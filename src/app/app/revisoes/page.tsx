import { createClient } from "@/lib/supabase/server";
import { getReviewQueue } from "@/lib/data";
import ReviewQueueSection from "@/components/review-queue-section";

export default async function RevisoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const queue = await getReviewQueue(supabase, user!.id);

  return (
    <div className="space-y-8">
      <h1 className="text-lg font-semibold text-foreground">Fila de revisões</h1>

      <ReviewQueueSection
        title="Atrasadas"
        items={queue.atrasadas}
        tone="danger"
        emptyLabel="Nenhuma revisão atrasada. Bom trabalho!"
      />
      <ReviewQueueSection
        title="Hoje"
        items={queue.hoje}
        tone="warning"
        emptyLabel="Nenhuma revisão para hoje."
      />
      <ReviewQueueSection
        title="Próximas"
        items={queue.proximas}
        tone="neutral"
        emptyLabel="Nenhuma revisão futura agendada ainda."
      />
    </div>
  );
}
