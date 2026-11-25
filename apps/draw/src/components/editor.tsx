"use client";
import "@excalidraw/excalidraw/index.css";
import {
  CaptureUpdateAction,
  Excalidraw,
  MainMenu,
  reconcileElements,
  restoreElements,
} from "@excalidraw/excalidraw";
import type { RemoteExcalidrawElement } from "@excalidraw/excalidraw/data/reconcile";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadMissingFiles, uploadNewFiles } from "./files.ts";
import { registerPageTools } from "./webmcp.ts";

type SyncState = "saved" | "saving" | "offline";

const SYNC_LABEL: Record<SyncState, string> = {
  offline: "Offline",
  saved: "Saved",
  saving: "Saving",
};

/** The board document as the server stores and sends it. */
interface RemoteDoc {
  appState?: { viewBackgroundColor?: string };
  elements: ExcalidrawElement[];
  name: string;
}

/** Mutable sync bookkeeping that must not trigger re-renders. */
interface SyncBook {
  background: string;
  dirty: boolean;
  etag: string;
  flushing: boolean;
  flushTimer: ReturnType<typeof setTimeout>;
  getUrl: string;
  headUrl: string;
  pollExpiresAt: number;
  synced: Map<string, number>;
  uploaded: Set<string>;
}

const FLUSH_DELAY_MS = 300;

// R2 marks ETags weak (W/) when it compresses the response; the hash is the same.
const WEAK_ETAG_RE = /^W\//;
const sameEtag = (a: string | null, b: string) =>
  a ? a.replace(WEAK_ETAG_RE, "") === b.replace(WEAK_ETAG_RE, "") : null;
const POLL_MS = 1500;
const HIDDEN_POLL_MS = 15_000;

/** Record the newest version of each element the server has. */
function markSynced(
  synced: Map<string, number>,
  elements: readonly { id: string; version: number }[]
) {
  for (const el of elements) {
    synced.set(el.id, Math.max(el.version, synced.get(el.id) ?? 0));
  }
}

const goHome = () => {
  window.location.href = "/";
};

const goConnect = () => {
  window.location.href = "/connect";
};

function SyncStatus({ status }: { status: SyncState }) {
  return (
    <span
      className="sync-status"
      data-state={status}
      title={
        status === "offline" ? "Can't reach the server; retrying" : undefined
      }
    >
      <i aria-hidden />
      {SYNC_LABEL[status]}
    </span>
  );
}

export default function Editor({ boardId }: { boardId: string }) {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initial, setInitial] = useState<ExcalidrawInitialDataState | null>(
    null
  );
  const [name, setName] = useState("");
  const [status, setStatus] = useState<SyncState>("saved");
  const [error, setError] = useState<string | null>(null);

  const s = useRef<SyncBook>({
    background: "",
    dirty: false,
    etag: "",
    flushing: false,
    flushTimer: 0 as unknown as SyncBook["flushTimer"],
    getUrl: "",
    headUrl: "",
    pollExpiresAt: 0,
    synced: new Map<string, number>(),
    uploaded: new Set<string>(),
  });

  const fetchBoard = useCallback(async () => {
    const res = await fetch(`/api/boards/${boardId}`, { cache: "no-store" });
    if (res.status === 401) {
      window.location.href = `/login?next=/b/${boardId}`;
      throw new Error("signed out");
    }
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? "This board doesn't exist."
          : `Couldn't load the board (${res.status}).`
      );
    }
    const data = await res.json();
    s.current.headUrl = data.headUrl;
    s.current.getUrl = data.getUrl;
    s.current.pollExpiresAt = data.pollExpiresAt;
    return data as { doc: RemoteDoc; etag: string };
  }, [boardId]);

  // Initial load.
  useEffect(() => {
    fetchBoard()
      .then(({ doc, etag }) => {
        s.current.etag = etag;
        s.current.background = doc.appState?.viewBackgroundColor ?? "#ffffff";
        markSynced(s.current.synced, doc.elements);
        // Files on the server were uploaded already.
        for (const el of doc.elements) {
          if (el.type === "image" && el.fileId) {
            s.current.uploaded.add(el.fileId);
          }
        }
        setName(doc.name);
        setInitial({
          appState: { viewBackgroundColor: s.current.background },
          elements: restoreElements(doc.elements, null, {
            refreshDimensions: true,
            repairBindings: true,
          }),
          scrollToContent: true,
        });
      })
      .catch((e) => setError(e.message));
  }, [fetchBoard]);

  useEffect(() => {
    if (name) {
      document.title = `${name} · Draw`;
    }
  }, [name]);

  const applyRemote = useCallback(
    (doc: RemoteDoc) => {
      if (!api) {
        return;
      }
      const remote = restoreElements(doc.elements, null, {
        refreshDimensions: true,
        repairBindings: false,
      });
      const local = api.getSceneElementsIncludingDeleted();
      const merged = reconcileElements(
        local,
        remote as RemoteExcalidrawElement[],
        api.getAppState()
      );
      markSynced(s.current.synced, doc.elements);
      const bg = doc.appState?.viewBackgroundColor;
      const bgChanged = bg && bg !== api.getAppState().viewBackgroundColor;
      if (bgChanged) {
        s.current.background = bg;
      }
      api.updateScene({
        elements: merged,
        ...(bgChanged ? { appState: { viewBackgroundColor: bg } } : {}),
        captureUpdate: CaptureUpdateAction.NEVER,
      });
      if (doc.name) {
        setName(doc.name);
      }
      loadMissingFiles(api, merged).catch(() => {
        // Images that fail to load stay as placeholders.
      });
    },
    [api]
  );

  const flush = useCallback(async () => {
    if (!api) {
      return;
    }
    // biome-ignore lint/suspicious/noUnnecessaryConditions: an earlier flush() may still be in flight across its awaits
    if (s.current.flushing) {
      s.current.dirty = true;
      return;
    }
    s.current.flushing = true;
    try {
      do {
        s.current.dirty = false;
        const elements = api.getSceneElementsIncludingDeleted();
        const changed = elements.filter(
          (el) => el.version > (s.current.synced.get(el.id) ?? 0)
        );
        const bg = api.getAppState().viewBackgroundColor;
        const bgChanged = bg !== s.current.background;
        if (!(changed.length || bgChanged)) {
          break;
        }
        setStatus("saving");
        // biome-ignore lint/performance/noAwaitInLoops: saves run one batch at a time; the loop repeats only if edits arrived during the last save
        await uploadNewFiles(api.getFiles(), changed, s.current.uploaded);
        const body = JSON.stringify({
          elements: changed,
          ...(bgChanged ? { appState: { viewBackgroundColor: bg } } : {}),
        });
        const res = await fetch(`/api/boards/${boardId}/elements`, {
          body,
          headers: { "content-type": "application/json" },
          // Lets a save started as the tab closes finish; browsers cap keepalive bodies at 64 KB.
          keepalive: body.length < 60_000,
          method: "POST",
        });
        if (!res.ok) {
          throw new Error(`save failed: ${res.status}`);
        }
        markSynced(s.current.synced, changed);
        s.current.background = bg;
        // biome-ignore lint/suspicious/noUnnecessaryConditions: a flush() call during the awaits above sets dirty
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

  // Poll for changes made by agents. In production this sends HEAD requests
  // straight to R2 with presigned URLs and fetches the board only when its ETag changes.
  useEffect(() => {
    if (!api) {
      return;
    }
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    // Refetch through the API, which also hands out fresh presigned URLs.
    const refetch = async () => {
      const { doc, etag } = await fetchBoard();
      s.current.etag = etag;
      applyRemote(doc);
    };
    // Cheap check: HEAD the board and GET it only if the ETag moved.
    const checkHead = async () => {
      const credentials = s.current.headUrl.startsWith("/")
        ? "same-origin"
        : "omit";
      const head = await fetch(s.current.headUrl, {
        cache: "no-store",
        credentials,
        method: "HEAD",
      });
      if (head.status === 403 || head.status === 401) {
        s.current.pollExpiresAt = 0;
        return;
      }
      if (
        !head.ok ||
        sameEtag(head.headers.get("etag"), s.current.etag) !== false
      ) {
        return;
      }
      const res = await fetch(s.current.getUrl, {
        cache: "no-store",
        credentials,
      });
      if (res.ok) {
        s.current.etag = res.headers.get("etag") ?? "";
        applyRemote(await res.json());
      }
    };
    const tick = async () => {
      try {
        if (Date.now() > s.current.pollExpiresAt - 60_000) {
          await refetch();
        } else {
          await checkHead();
        }
        setStatus((prev) => (prev === "offline" ? "saved" : prev));
      } catch {
        // Network blip; try again next tick.
      }
      if (!stopped) {
        timer = setTimeout(
          tick,
          document.visibilityState === "visible" ? POLL_MS : HIDDEN_POLL_MS
        );
      }
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
    if (api && initial?.elements) {
      loadMissingFiles(api, initial.elements).catch(() => {
        // Images that fail to load stay as placeholders.
      });
    }
  }, [api, initial]);

  // Save on tab close if anything is pending.
  useEffect(() => {
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [flush]);

  // Page-only WebMCP tools that need the live editor (selection, mermaid, focus).
  useEffect(() => {
    if (!api) {
      return;
    }
    return registerPageTools(api, boardId, () => name);
  }, [api, boardId, name]);

  const renderTopRightUI = useCallback(
    () => <SyncStatus status={status} />,
    [status]
  );

  if (error) {
    return (
      <main className="page">
        <p>{error}</p>
        <a href="/">All boards</a>
      </main>
    );
  }
  if (!initial) {
    return null;
  }

  return (
    <div className="editor">
      <Excalidraw
        excalidrawAPI={setApi}
        initialData={initial}
        name={name}
        onChange={onChange}
        renderTopRightUI={renderTopRightUI}
      >
        <MainMenu>
          <MainMenu.Item onSelect={goHome}>All boards</MainMenu.Item>
          <MainMenu.Item onSelect={goConnect}>Connect an agent</MainMenu.Item>
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
