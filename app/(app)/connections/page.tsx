import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function ConnectionsPage() {
  const userId = await getCurrentUserId();
  const targets = await prisma.connectionTarget.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
  return (
    <>
      <PageHeader title="Connection CRM" description="Add manually researched people, score relevance, draft notes, and track only manually completed LinkedIn actions." action={<Button asChild><Link href="/connections/new">Add target</Link></Button>} />
      <div className="grid gap-3">
        {targets.map((target) => {
          const score = Math.round((target.careerRelevance + target.sharedInterests + target.industryMatch + target.roleRelevance + target.networkingValue + target.personalizationScore) / 6);
          return (
            <Link key={target.id} href={`/connections/${target.id}`} className="block">
              <Card className="transition hover:border-primary">
                <CardContent className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
                  <div><p className="font-medium">{target.name}</p><p className="text-sm text-muted-foreground">{target.currentRole ?? "Role not added"}{target.company ? ` at ${target.company}` : ""}</p></div>
                  <div className="flex flex-wrap items-center gap-2"><Badge>{score}% fit</Badge><Badge variant="outline">{target.status.replaceAll("_", " ").toLowerCase()}</Badge></div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {!targets.length ? <Card><CardContent className="pt-6 text-sm text-muted-foreground">Add targets manually. This app does not scrape LinkedIn.</CardContent></Card> : null}
      </div>
    </>
  );
}
