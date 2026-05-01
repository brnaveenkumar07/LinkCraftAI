import { saveProfile } from "@/lib/actions";
import { getCurrentUserId } from "@/lib/user";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

export default async function OnboardingPage() {
  const userId = await getCurrentUserId();
  const profile = await prisma.userProfile.findUnique({ where: { userId }, include: { skills: true, interests: true, projects: true, pastPosts: true } });

  return (
    <>
      <PageHeader title="Profile Setup" description="Add only data you are comfortable using for AI-assisted drafting. Resume text and posts stay in your database." />
      <Card>
        <CardContent className="pt-6">
          <form action={saveProfile} className="grid gap-5 lg:grid-cols-2">
            <Field label="Full name" name="fullName" defaultValue={profile?.fullName} required />
            <Field label="Headline" name="headline" defaultValue={profile?.headline ?? ""} />
            <Field label="Current role/student status" name="currentRole" defaultValue={profile?.currentRole ?? ""} />
            <Field label="Location" name="location" defaultValue={profile?.location ?? ""} />
            <Area label="Resume text or uploaded resume content" name="resumeText" defaultValue={profile?.resumeText ?? ""} />
            <Area label="Career goals" name="careerGoals" defaultValue={profile?.careerGoals ?? ""} />
            <Area label="Skills (comma or line separated)" name="skills" defaultValue={profile?.skills.map((s) => s.name).join(", ")} />
            <Area label="Interests" name="interests" defaultValue={profile?.interests.map((s) => s.name).join(", ")} />
            <Area label="Target roles" name="targetRoles" defaultValue={profile?.targetRoles.join(", ")} />
            <Area label="Target industries" name="targetIndustries" defaultValue={profile?.targetIndustries.join(", ")} />
            <Area label="Existing LinkedIn About section" name="linkedinBio" defaultValue={profile?.linkedinBio ?? ""} />
            <Area label="LinkedIn links" name="linkedinLinks" defaultValue={profile?.linkedinLinks.join(", ")} />
            <Area label="Past LinkedIn posts" name="pastPosts" defaultValue={profile?.pastPosts.map((p) => p.content).join("\n")} />
            <Area label="Portfolio links" name="portfolioLinks" defaultValue={profile?.portfolioLinks.join(", ")} />
            <Area label="GitHub links" name="githubLinks" defaultValue={profile?.githubLinks.join(", ")} />
            <Area label="Projects (Title: description)" name="projects" defaultValue={profile?.projects.map((p) => `${p.title}: ${p.description}`).join("\n")} />
            <div className="space-y-2">
              <Label htmlFor="preferredTone">Preferred tone</Label>
              <select name="preferredTone" id="preferredTone" defaultValue={profile?.preferredTone ?? "PROFESSIONAL"} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                {["PROFESSIONAL", "FRIENDLY", "CONFIDENT", "CONCISE", "STORYTELLING"].map((tone) => <option key={tone}>{tone}</option>)}
              </select>
            </div>
            <div className="lg:col-span-2">
              <Button type="submit">Save profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function Field(props: { label: string; name: string; defaultValue?: string | null; required?: boolean }) {
  return <div className="space-y-2"><Label htmlFor={props.name}>{props.label}</Label><Input id={props.name} name={props.name} defaultValue={props.defaultValue ?? ""} required={props.required} /></div>;
}

function Area(props: { label: string; name: string; defaultValue?: string | null }) {
  return <div className="space-y-2"><Label htmlFor={props.name}>{props.label}</Label><Textarea id={props.name} name={props.name} defaultValue={props.defaultValue ?? ""} /></div>;
}
