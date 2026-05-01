import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getOptionalCurrentUserId, getOptionalSession } from "@/lib/user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppNav } from "@/components/app-nav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getOptionalSession();
  const userId = await getOptionalCurrentUserId();
  const profile = userId
    ? await prisma.userProfile.findUnique({ where: { userId } }).catch((error) => {
        console.error("Profile lookup failed", error);
        return null;
      })
    : null;

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-card/85 px-4 py-5 shadow-soft backdrop-blur-xl lg:block">
        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-foreground/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold">LinkCraft AI</div>
            <div className="text-xs text-muted-foreground">LinkedIn growth studio</div>
          </div>
        </Link>
        <AppNav />
        <div className="mt-8 rounded-lg border bg-secondary/50 p-4 text-sm shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <Badge variant="success">Compliance safe</Badge>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-3 leading-6 text-muted-foreground">
            Drafts are generated for review, editing, copying, and manual LinkedIn use only. No scraping or auto-sending.
          </p>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Growth workspace</p>
              <p className="truncate font-medium">{profile?.fullName ?? session?.user?.name ?? "Demo workspace"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/posts/new">New post</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/connections/new">Add target</Link>
              </Button>
            </div>
          </div>
          <AppNav compact className="mt-0 flex gap-2 space-y-0 overflow-x-auto border-t px-5 py-2 lg:hidden" />
        </header>
        <main className="mx-auto max-w-7xl px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
