import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    nextAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
    nextAuthUrl: Boolean(process.env.NEXTAUTH_URL),
    llmProvider: process.env.LLM_PROVIDER ?? null
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, checks, database: "reachable" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: false,
        checks,
        database: "unreachable",
        error: message
      },
      { status: 503 }
    );
  }
}
