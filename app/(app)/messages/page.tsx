import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { AiActionPanel } from "@/components/ai-action-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function MessagesPage() {
  const userId = await getCurrentUserId();
  const [targets, drafts] = await Promise.all([
    prisma.connectionTarget.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.messageDraft.findMany({ where: { userId }, include: { target: true }, orderBy: { createdAt: "desc" } })
  ]);
  const first = targets.find((target) => target.status === "CONNECTED") ?? targets[0];
  return (
    <>
      <PageHeader title="Direct Message Drafts" description="Draft respectful follow-ups for connected people. Copy and send manually only after review." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <AiActionPanel endpoint="/api/ai/messages" payload={{ targetId: first?.id, type: "CAREER_GUIDANCE" }} title="Generate message" buttonLabel="Draft DM" />
        <Card><CardHeader><CardTitle>Saved drafts</CardTitle></CardHeader><CardContent className="space-y-3">
          {drafts.map((draft) => <div key={draft.id} className="rounded-md border bg-background/70 p-3"><div className="mb-2 flex items-center justify-between"><Badge>{draft.type.replaceAll("_", " ").toLowerCase()}</Badge><span className="text-xs text-muted-foreground">{draft.target?.name ?? "General"}</span></div><p className="whitespace-pre-wrap text-sm text-muted-foreground">{draft.selectedText ?? draft.variations[0]}</p></div>)}
          {!drafts.length ? <p className="text-sm text-muted-foreground">No message drafts yet.</p> : null}
        </CardContent></Card>
      </div>
    </>
  );
}
