import { notFound } from "next/navigation";
import { ConnectionStatus } from "@prisma/client";
import { updateConnectionStatus } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { AiActionPanel } from "@/components/ai-action-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function ConnectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  const target = await prisma.connectionTarget.findFirst({ where: { id, userId }, include: { connectionDrafts: true, messageDrafts: true } });
  if (!target) notFound();
  const statuses = Object.values(ConnectionStatus);
  return (
    <>
      <PageHeader title={target.name} description={`${target.currentRole ?? "Connection target"}${target.company ? ` at ${target.company}` : ""}`} />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><CardHeader><CardTitle>Target profile</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
          <Badge>{target.status.replaceAll("_", " ").toLowerCase()}</Badge>
          <p>{target.whyConnect}</p><p className="text-muted-foreground">{target.notes}</p>
          <div className="flex flex-wrap gap-2">{target.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>
          <form action={async (formData) => { "use server"; await updateConnectionStatus(target.id, String(formData.get("status")) as ConnectionStatus); }} className="flex gap-2">
            <select name="status" defaultValue={target.status} className="h-10 flex-1 rounded-md border bg-background px-3 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select>
            <Button type="submit">Update</Button>
          </form>
        </CardContent></Card>
        <AiActionPanel endpoint="/api/ai/connections" payload={{ targetId: target.id, maxCharacters: 300 }} title="Connection note drafts" buttonLabel="Generate notes" />
      </div>
      <div className="mt-4"><AiActionPanel endpoint="/api/ai/messages" payload={{ targetId: target.id, type: "THANK_YOU" }} title="Follow-up DM drafts" buttonLabel="Generate DM" /></div>
    </>
  );
}
