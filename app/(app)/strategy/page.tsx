import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";

export default async function StrategyPage() {
  const userId = await getCurrentUserId();
  const [insight, targets, posts, calendar] = await Promise.all([
    prisma.aIInsight.findFirst({ where: { userId, category: "profile_analysis" }, orderBy: { createdAt: "desc" } }),
    prisma.connectionTarget.groupBy({ by: ["status"], where: { userId }, _count: true }),
    prisma.postDraft.count({ where: { userId } }),
    prisma.contentCalendarItem.count({ where: { userId } })
  ]);
  const content = insight?.content as { contentPillars?: string[]; idealConnectionPersonas?: string[]; weeklyStrategy?: string[]; targetAudience?: string } | undefined;
  return (
    <>
      <PageHeader title="AI Strategy" description="Review positioning, audience, pipeline distribution, and weekly focus." />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Draft posts" value={`${posts}`} />
        <MetricCard label="Calendar items" value={`${calendar}`} />
        <MetricCard label="Pipeline statuses" value={`${targets.length}`} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <StrategyCard title="Content pillars" items={content?.contentPillars ?? ["Projects", "Learning", "Career preparation"]} />
        <StrategyCard title="Connection personas" items={content?.idealConnectionPersonas ?? ["Engineers", "Recruiters", "AI builders"]} />
        <StrategyCard title="Weekly strategy" items={content?.weeklyStrategy ?? ["Post twice", "Add five targets", "Send thoughtful manual follow-ups"]} />
      </div>
      <Card className="mt-4"><CardHeader><CardTitle>Target audience</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{content?.targetAudience ?? "Run the profile analyzer for a personalized audience map."}</CardContent></Card>
    </>
  );
}

function StrategyCard({ title, items }: { title: string; items: string[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-2">{items.map((item) => <div key={item} className="rounded-md border bg-background/70 p-3 text-sm text-muted-foreground">{item}</div>)}</CardContent></Card>;
}
