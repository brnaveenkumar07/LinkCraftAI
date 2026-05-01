import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectionNotePrompt } from "@/lib/ai/prompts";
import { getLlmProvider, parseJsonResponse } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";
import { connectionNoteSchema } from "@/lib/validations/ai";
import { getCurrentUserId, getProfileContext } from "@/lib/user";

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  const limited = checkRateLimit(`connection:${userId}`);
  if (!limited.ok) return NextResponse.json({ error: `Rate limited. Try again in ${limited.retryAfter}s.` }, { status: 429 });

  const input = connectionNoteSchema.parse(await request.json());
  const target = await prisma.connectionTarget.findFirst({ where: { id: input.targetId, userId } });
  if (!target) return NextResponse.json({ error: "Connection target not found." }, { status: 404 });

  const profile = await getProfileContext(userId);
  const provider = getLlmProvider();
  const prompt = connectionNotePrompt(target, profile, input.maxCharacters);
  const raw = await provider.generate(
    [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    { format: "json" }
  );

  const output = parseJsonResponse(raw, {
    variations: [`Hi ${target.name}, I’m interested in your work${target.company ? ` at ${target.company}` : ""}. I’d be glad to connect and learn from your journey.`],
    confidenceScore: 70,
    explanation: "Uses manually provided role/company context and keeps the ask lightweight."
  });

  const draft = await prisma.connectionDraft.create({
    data: {
      targetId: target.id,
      variations: output.variations.map((note) => note.slice(0, input.maxCharacters)),
      selectedText: output.variations[0]?.slice(0, input.maxCharacters),
      confidenceScore: output.confidenceScore,
      explanation: output.explanation
    }
  });

  await prisma.connectionTarget.update({ where: { id: target.id }, data: { status: "DRAFT_READY" } });
  return NextResponse.json({ draft, ...output });
}
