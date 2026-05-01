import { addCalendarIdea } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function ContentCalendarPage() {
  const userId = await getCurrentUserId();
  const items = await prisma.contentCalendarItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Content Calendar" description="Plan ideas, drafts, ready posts, and posts you already published manually." />
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <Card><CardHeader><CardTitle>Add post idea</CardTitle></CardHeader><CardContent><form action={addCalendarIdea} className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>
          <div className="space-y-2"><Label>Content pillar</Label><Input name="pillar" /></div>
          <div className="space-y-2"><Label>Status</Label><select name="status" className="h-10 w-full rounded-md border bg-background px-3 text-sm"><option>IDEA</option><option>DRAFT</option><option>READY</option><option>POSTED_MANUALLY</option></select></div>
          <Button type="submit">Add idea</Button>
        </form></CardContent></Card>
        <Card><CardHeader><CardTitle>Weekly plan</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">
          {items.map((item) => <div key={item.id} className="rounded-md border bg-background/70 p-4"><div className="flex items-start justify-between gap-2"><p className="font-medium">{item.title}</p><Badge>{item.status.replaceAll("_", " ").toLowerCase()}</Badge></div><p className="mt-2 text-sm text-muted-foreground">{item.pillar ?? "No pillar"}</p></div>)}
          {!items.length ? <p className="text-sm text-muted-foreground">No calendar items yet.</p> : null}
        </CardContent></Card>
      </div>
    </>
  );
}
