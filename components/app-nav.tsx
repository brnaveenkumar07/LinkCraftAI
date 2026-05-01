"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, FileText, LayoutDashboard, MessageSquareText, Network, Settings, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: Sparkles },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/profile/analyzer", label: "Analyzer", icon: BarChart3 },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/content-calendar", label: "Calendar", icon: CalendarDays },
  { href: "/connections", label: "Connections", icon: Network },
  { href: "/messages", label: "Messages", icon: MessageSquareText },
  { href: "/strategy", label: "Strategy", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppNav({ className, compact = false }: { className?: string; compact?: boolean }) {
  const pathname = usePathname();
  const activeHref = nav
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className={cn("mt-8 space-y-1", className)}>
      {nav.map((item) => {
        const isActive = item.href === activeHref;

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
              compact && "w-auto shrink-0",
              isActive && "border border-primary/20 bg-primary/10 text-primary shadow-sm hover:bg-primary/15 hover:text-primary"
            )}
          >
            <Link href={item.href} aria-current={isActive ? "page" : undefined}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
