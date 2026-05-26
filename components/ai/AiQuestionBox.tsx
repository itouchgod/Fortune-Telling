"use client";

import { useState } from "react";
import { askAiQuestion } from "@/services/aiApi";

export default function AiQuestionBox({ chartId }: { chartId: string }) {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");

  async function handleAsk() {
    if (!question.trim()) {
      setMessage("请输入想追问的问题。");
      return;
    }
    const answer = await askAiQuestion(chartId, [
      {
        id: `msg_${Date.now()}`,
        role: "user",
        content: question,
        createdAt: new Date().toISOString()
      }
    ]);
    setMessage(answer.content);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="font-semibold text-ink">继续追问</h2>
      </div>
      <div className="panel-body grid gap-3">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
        placeholder="AI 问答功能正在接入中"
          className="focus-ring resize-y rounded-md border border-line px-3 py-2"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleAsk} className="focus-ring rounded-md bg-jade px-4 py-2 text-sm font-medium text-white">查看接入状态</button>
          {message && <span className="text-sm text-slate-600">{message}</span>}
        </div>
      </div>
    </section>
  );
}
