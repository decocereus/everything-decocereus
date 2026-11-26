"use client";

import Link from "next/link";
import { type KeyboardEvent, useCallback, useState } from "react";
import { useFormStatus } from "react-dom";
import { LocalTime } from "./local-time.tsx";

interface Props {
  board: { id: string; name: string; updatedAt: string };
  remove: (formData: FormData) => Promise<void>;
  rename: (formData: FormData) => Promise<void>;
}

type Mode = "view" | "rename" | "confirm";

const selectAll = (e: { currentTarget: HTMLInputElement }) =>
  e.currentTarget.select();

export function BoardRow({ board, remove, rename }: Props) {
  const [mode, setMode] = useState<Mode>("view");
  const cancel = useCallback(() => setMode("view"), []);
  const startRename = useCallback(() => setMode("rename"), []);
  const startDelete = useCallback(() => setMode("confirm"), []);
  const save = useCallback(
    async (fd: FormData) => {
      await rename(fd);
      setMode("view");
    },
    [rename]
  );
  const cancelOnEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setMode("view");
    }
  }, []);

  if (mode === "rename") {
    return (
      <li className="board-row" data-mode="rename">
        <form action={save} className="row grow">
          <input name="id" type="hidden" value={board.id} />
          <input
            aria-label="Board name"
            autoFocus
            className="input"
            defaultValue={board.name}
            name="name"
            onFocus={selectAll}
            onKeyDown={cancelOnEscape}
            required
          />
          <Submit label="Save" pendingLabel="Saving" />
          <button className="btn ghost" onClick={cancel} type="button">
            Cancel
          </button>
        </form>
      </li>
    );
  }

  if (mode === "confirm") {
    return (
      <li className="board-row" data-mode="confirm">
        <form action={remove} className="row grow">
          <input name="id" type="hidden" value={board.id} />
          <p className="confirm-text">
            Delete <strong>{board.name}</strong>? This can't be undone.
          </p>
          {/* The safe choice takes focus so a stray Enter doesn't delete. */}
          <button
            autoFocus
            className="btn ghost"
            onClick={cancel}
            type="button"
          >
            Cancel
          </button>
          <Submit danger label="Delete" pendingLabel="Deleting" />
        </form>
      </li>
    );
  }

  return (
    <li className="board-row">
      <Link className="name" href={`/b/${board.id}`}>
        {board.name}
      </Link>
      <span className="meta">
        <LocalTime iso={board.updatedAt} />
      </span>
      <span className="actions">
        <button className="text-btn" onClick={startRename} type="button">
          Rename
        </button>
        <button className="danger text-btn" onClick={startDelete} type="button">
          Delete
        </button>
      </span>
    </li>
  );
}

export function Submit({
  danger = false,
  label,
  pendingLabel,
}: {
  danger?: boolean;
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  const text = pending ? pendingLabel : label;
  return (
    <button
      className={danger ? "btn danger-solid" : "btn"}
      disabled={pending}
      type="submit"
    >
      {text}
    </button>
  );
}
