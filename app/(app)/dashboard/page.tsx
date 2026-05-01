import Link from "next/link";
import { ArrowRight, CheckCircle2, Network, PenLine, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getOptionalCurrentUserId } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/metric-card";
import { ManualWorkflow } from "@/components/manual-workflow";
import { PageHeader } from "@/components/page-header";

export default async function DashboardPage() {
  const userId = await getOptionalCurrentUserId();
  if (!userId) return <DashboardUnavailable />;

  const dashboardData = await Promise.all([
    prisma.userProfile.findUnique({ where: { userId }, include: { skills: true, interests: true } }),
    prisma.connectionTarget.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 5 }),
    prisma.postDraft.count({ where: { userId } }),
    prisma.messageDraft.count({ where: { userId } }),
    prisma.aIInsight.findFirst({ where: { userId, category: "profile_analysis" }, orderBy: { createdAt: "desc" } })
  ]).catch((error) => {
    console.error("Dashboard data lookup failed", error);
    return null;
  });

  if (!dashboardData) return <DashboardUnavailable />;

  const [profile, targets, posts, messages, insights] = dashboardData;

  const insight = insights?.content as { profileStrengthScore?: number; contentConsistencyScore?: number; weeklyStrategy?: string[] } | undefined;
  const connected = targets.filter((target) => target.status === "CONNECTED" || target.status === "REPLIED").length;

  return (
    <>
      <section className="mb-6 overflow-hidden rounded-lg border bg-card/95 shadow-soft">
        <div className="grid gap-6 p-5 md:grid-cols-[1.25fr_0.75fr] md:p-7">
          <div>
            <Badge className="mb-5" variant="outline">Portfolio-grade LinkedIn workspace</Badge>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Build a sharper LinkedIn presence with drafts you still control.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              A calm command center for profile positioning, content momentum, and relationship building without automating LinkedIn actions.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/profile/analyzer">
                  Run analyzer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/posts/new">Generate post</Link>
              </Button>
            </div>
          </div>
          <div className="grid content-between gap-3 rounded-lg border bg-background/70 p-4">
            {[
              { label: "Manual-safe workflow", value: "6 review steps", icon: ShieldCheck },
              { label: "Content drafts", value: `${posts} ready to refine`, icon: PenLine },
              { label: "Network pipeline", value: `${targets.length} active targets`, icon: Network },
              { label: "Quality posture", value: `${insight?.profileStrengthScore ?? 72}% profile strength`, icon: CheckCircle2 }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-md border bg-card px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageHeader
        title="Strategy Dashboard"
        description="Track the operating signals that matter: profile clarity, content consistency, and warm relationship progress."
      />
      <ManualWorkflow />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Profile strength" value={`${insight?.profileStrengthScore ?? 72}%`} helper="Based on profile completeness and clarity" progress={insight?.profileStrengthScore ?? 72} />
        <MetricCard label="Content consistency" value={`${insight?.contentConsistencyScore ?? 48}%`} helper="Draft and calendar activity" progress={insight?.contentConsistencyScore ?? 48} />
        <MetricCard label="Networking pipeline" value={`${targets.length}`} helper={`${connected} connected or replied`} />
        <MetricCard label="Draft queue" value={`${posts + messages}`} helper={`${posts} posts and ${messages} messages`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Suggested next actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(insight?.weeklyStrategy ?? [
              "Complete onboarding profile details and run the analyzer.",
              "Create one project showcase post and one learning journey post.",
              "Add five relevant connection targets from your own research."
            ]).map((action) => (
              <div key={action} className="rounded-md border bg-background/70 p-3 text-sm leading-6">{action}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent connection targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {targets.length ? targets.map((target) => (
              <Link key={target.id} href={`/connections/${target.id}`} className="block rounded-md border bg-background/70 p-3 transition hover:border-primary">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{target.name}</p>
                    <p className="text-sm text-muted-foreground">{target.currentRole ?? "Role not added"}{target.company ? ` at ${target.company}` : ""}</p>
                  </div>
                  <Badge>{target.status.replaceAll("_", " ").toLowerCase()}</Badge>
                </div>
              </Link>
            )) : <p className="text-sm text-muted-foreground">No targets yet. Add people manually from your approved research.</p>}
          </CardContent>
        </Card>
      </div>
      {!profile ? (
        <Card className="mt-6 border-primary/30">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Start with your resume, skills, projects, and goals so the AI can personalize drafts.</p>
            <Button asChild><Link href="/onboarding">Start onboarding</Link></Button>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

function DashboardUnavailable() {
  return (
    <>
      <PageHeader
        title="Dashboard setup needed"
        description="The app is deployed, but the server could not read the production database configuration."
      />
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle>Production runtime check failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-6 text-muted-foreground">
          <p>
            Verify that Vercel has the same required environment variables as your local `.env`, then redeploy after
            applying Prisma migrations.
          </p>
          <div className="rounded-md border bg-background/70 p-3 font-mono text-xs text-foreground">
            DATABASE_URL<br />
            NEXTAUTH_SECRET<br />
            NEXTAUTH_URL
          </div>
          <p>
            You can also open <span className="font-mono text-foreground">/api/health</span> on the deployed app to
            confirm whether the database is reachable.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
