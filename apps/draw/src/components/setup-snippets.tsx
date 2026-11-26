"use client";
import { useCallback, useState } from "react";
import type { Setup } from "@/lib/connect.ts";

interface Props {
  masked: Setup[];
  real: Setup[];
}

/** Snippets show a placeholder until revealed; Copy always copies the real token. */
export function SetupSnippets({ masked, real }: Props) {
  const [revealed, setRevealed] = useState(false);
  const toggle = useCallback(() => setRevealed((r) => !r), []);
  const shown = revealed ? real : masked;
  return (
    <>
      <div className="row connect-toggle">
        <button
          aria-pressed={revealed}
          className="btn ghost"
          onClick={toggle}
          type="button"
        >
          {revealed ? "Hide token" : "Show token"}
        </button>
        <span className="meta">
          The token gives full access to your boards. Keep it out of shared
          repos.
        </span>
      </div>
      {shown.map((setup, i) => (
        <section className="setup" id={setup.id} key={setup.id}>
          <h2>{setup.name}</h2>
          <div className="snippet-head">
            <p className="meta">{setup.where}</p>
            <CopyButton text={real[i].code} />
          </div>
          <pre className="snippet">
            <code>{setup.code}</code>
          </pre>
          {setup.note ? <p className="note">{setup.note}</p> : null}
        </section>
      ))}
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setLabel("Copied");
    } catch {
      // Clipboard access can be denied (permissions, insecure context).
      setLabel("Copy failed, select the text instead");
    }
    setTimeout(() => setLabel("Copy"), 2000);
  }, [text]);
  return (
    <button className="copy" onClick={copy} type="button">
      {label}
    </button>
  );
}
