import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(2),
  headline: z.string().max(180).optional(),
  currentRole: z.string().optional(),
  location: z.string().optional(),
  resumeText: z.string().max(12000).optional(),
  skills: z.string().optional(),
  interests: z.string().optional(),
  targetRoles: z.string().optional(),
  targetIndustries: z.string().optional(),
  careerGoals: z.string().max(4000).optional(),
  preferredTone: z.enum(["PROFESSIONAL", "FRIENDLY", "CONFIDENT", "CONCISE", "STORYTELLING"]),
  linkedinBio: z.string().max(4000).optional(),
  linkedinLinks: z.string().optional(),
  pastPosts: z.string().max(12000).optional(),
  portfolioLinks: z.string().optional(),
  githubLinks: z.string().optional(),
  projects: z.string().max(8000).optional()
});

export type ProfileInput = z.infer<typeof profileSchema>;
