"use client";

import { useState } from "react";
import RegisterSessionForm from "@/components/register-session-form";
import EditReviewDateForm from "@/components/edit-review-date-form";
import StepLadder from "@/components/step-ladder";
import type { ReviewQueueItem } from "@/lib/data";

const TONE_BAR: Record<string, string> = {
  danger: "border-l-danger",
  warning: "border-l-accent-dark",
  neutral: "border-l-border",
};

const TONE_DOT: Record<string, string> = {
  danger: "bg-danger",
  warning: "bg-accent-dark",
  neutral: "bg-muted",
};

type Panel = "register" | "edit-date" | null;

export default function ReviewQueueSection({
  title,
  items,
  tone = "neutral",
  emptyLabel,
}: {
  title: string;
  items: ReviewQueueItem[];
  tone?: "danger" | "warning" | "neutral";
  emptyLabel: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  function toggle(id: string, panel: Panel) {
    if (openId === id && openPanel === panel) {
      setOpenId(null);
      setOpenPanel(null);
    } else {
      setOpenId(id);
      setOpenPanel(panel);
    }
  }

  return (
    <section className="overflow-hidden rounded-sm border border-border bg-white">
      <h2 className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
        <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
        {title}
        <span className="text-muted/60">({items.length})</span>
      </h2>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted sm:px-5">{emptyLabel}</p>
      ) : (
        <div className="divide-y divide-dashed divide-border">
          {items.map((item, i) => (
            <div key={item.id} className={`border-l-4 ${TONE_BAR[tone]}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                <div className="flex min-w-0 items-baseline gap-2.5">
                  <span className="font-mono-label text-[10px] text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.topic_name}</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-danger">
                      {item.subject_name} deve ser revisado até ·{" "}
                      {new Date(item.due_date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <StepLadder step={item.step} />
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(item.id, "edit-date")}
                      className="rounded-sm border border-border px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      {openId === item.id && openPanel === "edit-date" ? "Fechar" : "Reagendar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(item.id, "register")}
                      className="rounded-sm bg-primary px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
                    >
                      {openId === item.id && openPanel === "register" ? "Fechar" : "Registrar"}
                    </button>
                  </div>
                </div>
              </div>

              {openId === item.id && openPanel === "register" && (
                <div className="border-t border-dashed border-border bg-surface/60 px-4 py-4 sm:px-5">
                  <RegisterSessionForm
                    topics={[
                      {
                        id: item.topic_id,
                        name: item.topic_name,
                        subjectId: "",
                        subjectName: item.subject_name,
                      },
                    ]}
                    defaultTopicId={item.topic_id}
                    reviewScheduleId={item.id}
                    onDone={() => {
                      setOpenId(null);
                      setOpenPanel(null);
                    }}
                  />
                </div>
              )}

              {openId === item.id && openPanel === "edit-date" && (
                <div className="border-t border-dashed border-border bg-surface/60 px-4 py-4 sm:px-5">
                  <EditReviewDateForm
                    reviewScheduleId={item.id}
                    currentDueDate={item.due_date}
                    onDone={() => {
                      setOpenId(null);
                      setOpenPanel(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
