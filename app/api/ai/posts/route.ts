import { NextRequest, NextResponse } from "next/server";
import { PostType, Tone } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { postPrompt } from "@/lib/ai/prompts";
import { getLlmProvider, parseJsonResponse } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";
import { postGenerationSchema } from "@/lib/validations/ai";
import { getCurrentUserId, getProfileContext } from "@/lib/user";

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  const limited = checkRateLimit(`post:${userId}`);
  if (!limited.ok) return NextResponse.json({ error: `Rate limited. Try again in ${limited.retryAfter}s.` }, { status: 429 });

  const input = postGenerationSchema.parse(await request.json());
  const profile = await getProfileContext(userId);
  const provider = getLlmProvider();
  const prompt = postPrompt(input, profile);
  const raw = await provider.generate(
    [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    { format: "json" }
  );

  const output = parseJsonResponse(raw, {
    variations: [`Today I worked on ${input.topic}. The biggest takeaway was turning ideas into clear, usable software.`],
    hooks: [`What ${input.topic} taught me`],
    hashtags: ["#SoftwareEngineering", "#FullStack", "#LearningInPublic"],
    bestPostingTime: "Tuesday to Thursday, 9:00-11:00 AM local time"
  });

  const draft = await prisma.postDraft.create({
    data: {
      userId,
      type: input.type as PostType,
      topic: input.topic,
      goal: input.goal,
      targetAudience: input.targetAudience,
      tone: input.tone as Tone,
      length: input.length,
      includeHashtags: input.includeHashtags,
      includeEmojis: input.includeEmojis,
      includeCallToAction: input.includeCallToAction,
      variations: output.variations,
      selectedText: output.variations[0],
      hooks: output.hooks,
      hashtags: output.hashtags,
      bestPostingTime: output.bestPostingTime
    }
  });

  await prisma.promptRun.create({
    data: {
      userId,
      category: "linkedin_post_generation",
      provider: provider.name,
      model: provider.model,
      promptPreview: prompt.user.slice(0, 1000),
      output
    }
  });

  return NextResponse.json({ draft, ...output });
}
