import { z } from "zod";

export const postGenerationSchema = z.object({
  type: z.enum([
    "PROJECT_SHOWCASE",
    "INTERNSHIP_COMPLETION",
    "LEARNING_JOURNEY",
    "TECHNICAL_EXPLANATION",
    "ACHIEVEMENT",
    "JOB_SEEKING",
    "PORTFOLIO_LAUNCH",
    "NETWORKING",
    "PLACEMENT_PREPARATION",
    "THOUGHT_LEADERSHIP"
  ]),
  topic: z.string().min(3).max(280),
  goal: z.string().max(500).optional(),
  targetAudience: z.string().max(300).optional(),
  tone: z.enum(["PROFESSIONAL", "FRIENDLY", "CONFIDENT", "CONCISE", "STORYTELLING"]),
  length: z.enum(["short", "medium", "long"]),
  includeHashtags: z.boolean().default(true),
  includeEmojis: z.boolean().default(false),
  includeCallToAction: z.boolean().default(true)
});

export const connectionTargetSchema = z.object({
  name: z.string().min(2),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  whyConnect: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional()
});

export const connectionNoteSchema = z.object({
  targetId: z.string().min(1),
  maxCharacters: z.number().min(120).max(300).default(300)
});

export const messageDraftSchema = z.object({
  targetId: z.string().optional(),
  type: z.enum([
    "THANK_YOU",
    "CAREER_GUIDANCE",
    "REFERRAL_REQUEST",
    "COLLABORATION",
    "PROJECT_FEEDBACK",
    "ALUMNI_NETWORKING",
    "RECRUITER_OUTREACH"
  ]),
  context: z.string().max(1000).optional()
});

export type PostGenerationInput = z.infer<typeof postGenerationSchema>;
export type ConnectionTargetInput = z.infer<typeof connectionTargetSchema>;
