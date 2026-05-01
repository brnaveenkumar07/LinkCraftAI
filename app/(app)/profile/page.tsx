import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();
  const profile = await prisma.userProfile.findUnique({ where: { userId }, include: { skills: true, interests: true, projects: true, pastPosts: true } });
  if (!profile) return <PageHeader title="Profile" description="No profile yet." action={<Button asChild><Link href="/onboarding">Start onboarding</Link></Button>} />;

  return (
    <>
      <PageHeader title={profile.fullName} description={profile.headline ?? "LinkedIn growth profile"} action={<Button asChild><Link href="/onboarding">Edit profile</Link></Button>} />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><CardHeader><CardTitle>Positioning</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>{profile.currentRole}</p><p>{profile.location}</p><p>{profile.careerGoals}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Skills and interests</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2">{profile.skills.map((s) => <Badge key={s.id}>{s.name}</Badge>)}</div><div className="flex flex-wrap gap-2">{profile.interests.map((s) => <Badge key={s.id} variant="outline">{s.name}</Badge>)}</div></CardContent></Card>
      </div>
      <Card className="mt-4">
        <CardHeader><CardTitle>Source links</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[...profile.portfolioLinks, ...profile.githubLinks, ...profile.linkedinLinks].map((href) => (
            <Button key={href} asChild variant="outline" size="sm"><Link href={href} target="_blank" rel="noreferrer">{href}</Link></Button>
          ))}
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="grid items-stretch gap-4 md:grid-cols-3">
          {profile.projects.map((project) => (
            <article
              key={project.id}
              className="flex min-h-72 flex-col rounded-lg border bg-background p-5 shadow-sm transition-colors hover:border-primary/25"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold leading-6 tracking-tight">{project.title}</h3>
                {project.link ? (
                  <Button asChild variant="ghost" size="icon" className="-mr-1 -mt-1 h-8 w-8 shrink-0" title="Open live demo">
                    <Link href={project.link} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{project.description}</p>
              <div className="mt-auto pt-6">
                {project.link ? (
                  <Button asChild variant="outline" size="sm" className="h-10 w-full rounded-lg">
                    <Link href={project.link} target="_blank" rel="noreferrer">
                      Live demo
                    </Link>
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
