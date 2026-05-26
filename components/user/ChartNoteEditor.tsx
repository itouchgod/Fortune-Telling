"use client";

import { useState } from "react";

interface ChartNoteEditorProps {
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}

export default function ChartNoteEditor({ initialNote, onSave, onClose }: ChartNoteEditorProps) {
  const [note, setNote] = useState(initialNote);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold text-ink">编辑备注</h2>
          <button onClick={onClose} className="focus-ring rounded-md border border-line px-3 py-1 text-sm">关闭</button>
        </div>
        <div className="grid gap-3 p-5">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={6}
            className="focus-ring rounded-md border border-line px-3 py-2"
          />
          <button onClick={() => onSave(note)} className="focus-ring rounded-md bg-jade px-4 py-2 text-sm font-medium text-white">
            保存备注
          </button>
        </div>
      </div>
    </div>
  );
}
