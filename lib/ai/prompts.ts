import type { PostGenerationInput } from "@/lib/validations/ai";

export const safetyRules = `
Compliance rules:
- Do not scrape LinkedIn, bypass restrictions, or imply automated sending.
- Draft only. The user must review, edit, approve, copy, and manually perform final LinkedIn actions.
- Do not invent private facts, fake familiarity, credentials, relationships, or guaranteed outcomes.
- Keep content professional, respectful, specific, and non-spammy.
`;

export function profileAnalysisPrompt(profile: unknown) {
  return {
    system:
      "You are a senior LinkedIn brand strategist for students and early-career software professionals. Return valid JSON only.",
    user: `${safetyRules}
Analyze this user profile and return JSON with keys: personalBrandSummary, contentPillars, targetAudience, idealConnectionPersonas, suggestedHeadline, suggestedAbout, strengths, improvementAreas, weeklyStrategy, profileStrengthScore, contentConsistencyScore.

Profile:
${JSON.stringify(profile, null, 2)}`
  };
}

export function postPrompt(input: PostGenerationInput, profile: unknown) {
  return {
    system: "You write polished LinkedIn drafts for human review. Return valid JSON only.",
    user: `${safetyRules}
Generate 3 LinkedIn post variations, 5 hooks, 8 hashtags, and a bestPostingTime suggestion.
Return JSON: { "variations": string[], "hooks": string[], "hashtags": string[], "bestPostingTime": string }.

Post request:
${JSON.stringify(input, null, 2)}

User context:
${JSON.stringify(profile, null, 2)}`
  };
}

export function connectionNotePrompt(target: unknown, profile: unknown, maxCharacters = 300) {
  return {
    system: "You draft concise LinkedIn connection notes. Return valid JSON only.",
    user: `${safetyRules}
Generate 3 personalized connection note variations. Each must be at most ${maxCharacters} characters.
Return JSON: { "variations": string[], "confidenceScore": number, "explanation": string }.

Target connection:
${JSON.stringify(target, null, 2)}

User context:
${JSON.stringify(profile, null, 2)}`
  };
}

export function dmPrompt(target: unknown, profile: unknown, type: string, context?: string) {
  return {
    system: "You draft respectful professional LinkedIn direct messages for human review. Return valid JSON only.",
    user: `${safetyRules}
Generate 3 concise DM variations for type "${type}". Include a polite CTA, avoid desperation, and avoid mass-message tone.
Return JSON: { "variations": string[] }.

Optional context:
${context ?? "None"}

Target:
${JSON.stringify(target, null, 2)}

User context:
${JSON.stringify(profile, null, 2)}`
  };
}

export function weeklyPlanPrompt(profile: unknown) {
  return {
    system: "You are a LinkedIn growth strategist. Return valid JSON only.",
    user: `${safetyRules}
Create a practical weekly LinkedIn plan. Return JSON: { "nextActions": string[], "postingPlan": string[], "networkingPlan": string[], "contentIdeas": string[] }.

User context:
${JSON.stringify(profile, null, 2)}`
  };
}
