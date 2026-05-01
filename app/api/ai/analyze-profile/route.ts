import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { profileAnalysisPrompt } from "@/lib/ai/prompts";
import { getLlmProvider, parseJsonResponse } from "@/lib/llm";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCurrentUserId, getProfileContext } from "@/lib/user";

export async function POST() {
  const userId = await getCurrentUserId();
  const limited = checkRateLimit(`analyze:${userId}`);
  if (!limited.ok) return NextResponse.json({ error: `Rate limited. Try again in ${limited.retryAfter}s.` }, { status: 429 });

  const profile = await getProfileContext(userId);
  if (!profile) return NextResponse.json({ error: "Complete onboarding first." }, { status: 400 });

  const provider = getLlmProvider();
  const prompt = profileAnalysisPrompt(profile);
  const raw = await provider.generate(
    [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    { format: "json" }
  );

  const fallback = {
    personalBrandSummary: "Full-stack and AI-focused software student building practical projects.",
    contentPillars: ["Full-stack builds", "AI learning", "Placement preparation"],
    targetAudience: "Recruiters, software engineers, founders, and students.",
    idealConnectionPersonas: ["Software engineers", "Recruiters", "AI builders"],
    suggestedHeadline: profile.headline ?? "Full-stack developer | AI builder | CS student",
    suggestedAbout: profile.linkedinBio ?? "",
    strengths: ["Clear technical direction"],
    improvementAreas: ["Add measurable project outcomes"],
    weeklyStrategy: ["Publish two posts", "Add five relevant connections", "Follow up with thoughtful messages"],
    profileStrengthScore: 76,
    contentConsistencyScore: 58
  };
  const output = parseJsonResponse(raw, fallback);

  await prisma.aIInsight.create({
    data: {
      userId,
      category: "profile_analysis",
      title: "Profile analysis",
      content: output
    }
  });

  await prisma.promptRun.create({
    data: {
      userId,
      category: "resume_analysis",
      provider: provider.name,
      model: provider.model,
      promptPreview: prompt.user.slice(0, 1000),
      output,
      safetyNotes: "Drafting and advisory only. No LinkedIn automation."
    }
  });

  return NextResponse.json(output);
}
