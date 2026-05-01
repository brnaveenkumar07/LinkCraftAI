import { NextRequest, NextResponse } from "next/server";
import { MessageType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dmPrompt } from "@/lib/ai/prompts";
import { getLlmProvider, parseJsonResponse } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";
import { messageDraftSchema } from "@/lib/validations/ai";
import { getCurrentUserId, getProfileContext } from "@/lib/user";

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  const limited = checkRateLimit(`dm:${userId}`);
  if (!limited.ok) return NextResponse.json({ error: `Rate limited. Try again in ${limited.retryAfter}s.` }, { status: 429 });

  const input = messageDraftSchema.parse(await request.json());
  const target = input.targetId ? await prisma.connectionTarget.findFirst({ where: { id: input.targetId, userId } }) : null;
  const profile = await getProfileContext(userId);
  const provider = getLlmProvider();
  const prompt = dmPrompt(target, profile, input.type, input.context);
  const raw = await provider.generate(
    [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    { format: "json" }
  );

  const output = parseJsonResponse(raw, {
    variations: ["Thanks for connecting. I appreciate your work and would be glad to learn from your experience when convenient."]
  });

  const draft = await prisma.messageDraft.create({
    data: {
      userId,
      targetId: target?.id,
      type: input.type as MessageType,
      variations: output.variations,
      selectedText: output.variations[0]
    }
  });

  return NextResponse.json({ draft, ...output });
}
