"use client";

import { useState } from "react";
import { generateReport } from "@/services/aiApi";

export default function GenerateReportButton({ chartId }: { chartId: string }) {
  const [message, setMessage] = useState("");

  async function handleClick() {
    const result = await generateReport(chartId);
    setMessage(result.message);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={handleClick} className="focus-ring rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
        命书功能暂未开放
      </button>
      {message && <span className="text-sm text-jade">{message}</span>}
    </div>
  );
}
