"use client";
import "@excalidraw/excalidraw/index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { CaptureUpdateAction, Excalidraw, MainMenu, reconcileElements, restoreElements } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import { loadMissingFiles, uploadNewFiles } from "./files";
import { registerPageTools } from "./webmcp";

type SyncState = "saved" | "saving" | "offline";

const FLUSH_DELAY_MS = 300;
const POLL_MS = 1500;
const HIDDEN_POLL_MS = 15000;

export default function Editor({ boardId }: { boardId: string }) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initial, setInitial] = useState<ExcalidrawInitialDataState | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<SyncState>("saved");
  const [error, setError] = useState<string | null>(null);

  // Mutable sync bookkeeping that must not trigger re-renders.
  const s = useRef({
    synced: new Map<string, number>(),
    uploaded: new Set<string>(),
    etag: "",
    pollUrl: "",
    pollExpiresAt: 0,
    flushTimer: 0 as unknown as ReturnType<typeof setTimeout>,
    flushing: false,
    dirty: false,
    background: "",
  });

  const markSynced = (elements: readonly { id: string; version: number }[]) => {
    for (const el of elements) s.current.synced.set(el.id, Math.max(el.version, s.current.synced.get(el.id) ?? 0));
  };

  const fetchBoard = useCallback(async () => {
    const res = await fetch(`/api/boards/${boardId}`, { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = `/login?next=/b/${boardId}`;
      throw new Error("signed out");
    }
    if (!res.ok) throw new Error(res.status === 404 ? "This board doesn't exist." : `Couldn't load the board (${res.status}).`);
    const data = await res.json();
    s.current.pollUrl = data.pollUrl;
    s.current.pollExpiresAt = data.pollExpiresAt;
    return data as { doc: any; etag: string };
  }, [boardId]);

  // Initial load.
  useEffect(() => {
    fetchBoard()
      .then(({ doc, etag }) => {
        s.current.etag = etag;
        s.current.background = doc.appState?.viewBackgroundColor ?? "#ffffff";
        markSynced(doc.elements);
        // Files on the server were uploaded already.
        for (const el of doc.elements) if (el.fileId) s.current.uploaded.add(el.fileId);
        setName(doc.name);
        setInitial({
          elements: restoreElements(doc.elements, null, { refreshDimensions: true, repairBindings: true }),
          appState: { viewBackgroundColor: s.current.background },
          scrollToContent: true,
        });
      })
      .catch((e) => setError(e.message));
  }, [fetchBoard]);

  useEffect(() => {
    if (name) document.title = `${name} · Draw`;
  }, [name]);

  const applyRemote = useCallback(
    (doc: any) => {
      if (!api) return;
      const remote = restoreElements(doc.elements, null, { refreshDimensions: true, repairBindings: false });
      const local = api.getSceneElementsIncludingDeleted();
      const merged = reconcileElements(local, remote as any, api.getAppState());
      markSynced(doc.elements);
      const bg = doc.appState?.viewBackgroundColor;
      const bgChanged = bg && bg !== api.getAppState().viewBackgroundColor;
      if (bgChanged) s.current.background = bg;
      api.updateScene({
        elements: merged,
        ...(bgChanged ? { appState: { viewBackgroundColor: bg } } : {}),
        captureUpdate: CaptureUpdateAction.NEVER,
      });
      if (doc.name) setName(doc.name);
      loadMissingFiles(api, merged).catch(() => {});
    },
    [api],
  );

  const flush = useCallback(async () => {
    if (!api) return;
    if (s.current.flushing) {
      s.current.dirty = true;
      return;
    }
    s.current.flushing = true;
    try {
      do {
        s.current.dirty = false;
        const elements = api.getSceneElementsIncludingDeleted();
        const changed = elements.filter((el) => el.version > (s.current.synced.get(el.id) ?? 0));
        const bg = api.getAppState().viewBackgroundColor;
        const bgChanged = bg !== s.current.background;
        if (!changed.length && !bgChanged) break;
        setStatus("saving");
        await uploadNewFiles(api.getFiles(), changed, s.current.uploaded);
        const body = JSON.stringify({ elements: changed, ...(bgChanged ? { appState: { viewBackgroundColor: bg } } : {}) });
        const res = await fetch(`/api/boards/${boardId}/elements`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          // Lets a save started as the tab closes finish; browsers cap keepalive bodies at 64 KB.
          keepalive: body.length < 60_000,
        });
        if (!res.ok) throw new Error(`save failed: ${res.status}`);
        markSynced(changed);
        s.current.background = bg;
      } while (s.current.dirty);
      setStatus("saved");
    } catch {
      setStatus("offline");
      clearTimeout(s.current.flushTimer);
      s.current.flushTimer = setTimeout(() => flush(), 3000);
    } finally {
      s.current.flushing = false;
    }
  }, [api, boardId]);

  const onChange = useCallback(() => {
    clearTimeout(s.current.flushTimer);
    s.current.flushTimer = setTimeout(() => flush(), FLUSH_DELAY_MS);
  }, [flush]);

  // Poll for changes made by agents. In production this hits R2 directly
  // with a presigned URL and a conditional GET, so idle polls are 304s.
  useEffect(() => {
    if (!api) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        if (Date.now() > s.current.pollExpiresAt - 60_000) {
          const { doc, etag } = await fetchBoard();
          s.current.etag = etag;
          applyRemote(doc);
        } else {
          const res = await fetch(s.current.pollUrl, {
            headers: s.current.etag ? { "if-none-match": s.current.etag } : {},
            cache: "no-store",
            credentials: s.current.pollUrl.startsWith("/") ? "same-origin" : "omit",
          });
          if (res.status === 200) {
            s.current.etag = res.headers.get("etag") ?? "";
            applyRemote(await res.json());
          } else if (res.status === 403 || res.status === 401) {
            s.current.pollExpiresAt = 0;
          }
        }
        setStatus((prev) => (prev === "offline" ? "saved" : prev));
      } catch {
        // Network blip; try again next tick.
      }
      if (!stopped) timer = setTimeout(tick, document.visibilityState === "visible" ? POLL_MS : HIDDEN_POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [api, applyRemote, fetchBoard]);

  // Load images once the editor exists.
  useEffect(() => {
    if (api && initial?.elements) loadMissingFiles(api, initial.elements).catch(() => {});
  }, [api, initial]);

  // Save on tab close if anything is pending.
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [flush]);

  // Page-only WebMCP tools that need the live editor (selection, mermaid, focus).
  useEffect(() => {
    if (!api) return;
    return registerPageTools(api, boardId, () => name);
  }, [api, boardId, name]);

  if (error) {
    return (
      <main className="page">
        <p>{error}</p>
        <a href="/">All boards</a>
      </main>
    );
  }
  if (!initial) return null;

  return (
    <div className="editor">
      <Excalidraw
        excalidrawAPI={setApi}
        initialData={initial}
        onChange={onChange}
        name={name}
        renderTopRightUI={() => (
          <span className="sync-status" data-state={status} title={status === "offline" ? "Can't reach the server; retrying" : undefined}>
            <i aria-hidden />
            {status === "saving" ? "Saving" : status === "offline" ? "Offline" : "Saved"}
          </span>
        )}
      >
        <MainMenu>
          <MainMenu.Item onSelect={() => (window.location.href = "/")}>All boards</MainMenu.Item>
          <MainMenu.Separator />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.Separator />
          <MainMenu.DefaultItems.ToggleTheme />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
