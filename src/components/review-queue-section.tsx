"use client";

import { useState } from "react";
import RegisterSessionForm from "@/components/register-session-form";
import { stepLabel } from "@/lib/review-engine";
import type { ReviewQueueItem } from "@/lib/data";

const TONE_STYLES: Record<string, string> = {
  danger: "border-red-200 bg-red-50",
  warning: "border-accent-dark/30 bg-accent-light/20",
  neutral: "border-border bg-white",
};

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

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">
        {title} <span className="text-muted">({items.length})</span>
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-muted">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 shadow-sm ${TONE_STYLES[tone]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{item.topic_name}</p>
                  <p className="text-xs text-muted">
                    {item.subject_name} · revisão {stepLabel(item.step)} ·{" "}
                    {new Date(item.due_date + "T00:00:00").toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  {openId === item.id ? "Fechar" : "Registrar resultado"}
                </button>
              </div>

              {openId === item.id && (
                <div className="mt-4 border-t border-border pt-4">
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
                    onDone={() => setOpenId(null)}
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
