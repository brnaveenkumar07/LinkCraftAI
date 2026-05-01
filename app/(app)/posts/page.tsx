import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export default async function PostsPage() {
  const userId = await getCurrentUserId();
  const drafts = await prisma.postDraft.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Post Drafts" description="Generate, review, edit, approve, copy, then manually publish on LinkedIn." action={<Button asChild><Link href="/posts/new">Generate post</Link></Button>} />
      <div className="grid gap-4">
        {drafts.map((draft) => (
          <Card key={draft.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div><CardTitle>{draft.topic}</CardTitle><p className="text-sm text-muted-foreground">{draft.type.replaceAll("_", " ").toLowerCase()}</p></div>
              <Badge>{draft.status.replaceAll("_", " ").toLowerCase()}</Badge>
            </CardHeader>
            <CardContent><p className="whitespace-pre-wrap text-sm text-muted-foreground">{draft.selectedText ?? draft.variations[0]}</p></CardContent>
          </Card>
        ))}
        {!drafts.length ? <Card><CardContent className="pt-6 text-sm text-muted-foreground">No post drafts yet.</CardContent></Card> : null}
      </div>
    </>
  );
}
