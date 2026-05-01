"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CalendarStatus, ConnectionStatus, Tone } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";
import { connectionTargetSchema } from "@/lib/validations/ai";
import { profileSchema } from "@/lib/validations/profile";

function splitList(value?: string | null) {
  return (value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveProfile(formData: FormData) {
  const userId = await getCurrentUserId();
  const input = profileSchema.parse(Object.fromEntries(formData));

  const profile = await prisma.userProfile.upsert({
    where: { userId },
    update: {
      fullName: input.fullName,
      headline: input.headline,
      currentRole: input.currentRole,
      location: input.location,
      resumeText: input.resumeText,
      targetRoles: splitList(input.targetRoles),
      targetIndustries: splitList(input.targetIndustries),
      careerGoals: input.careerGoals,
      preferredTone: input.preferredTone as Tone,
      linkedinBio: input.linkedinBio,
      linkedinLinks: splitList(input.linkedinLinks),
      portfolioLinks: splitList(input.portfolioLinks),
      githubLinks: splitList(input.githubLinks),
      skills: { deleteMany: {}, create: splitList(input.skills).map((name) => ({ name })) },
      interests: { deleteMany: {}, create: splitList(input.interests).map((name) => ({ name })) },
      pastPosts: input.pastPosts ? { deleteMany: {}, create: splitList(input.pastPosts).map((content) => ({ content })) } : undefined,
      projects: input.projects
        ? {
            deleteMany: {},
            create: splitList(input.projects).map((line) => {
              const [title, ...rest] = line.split(":");
              return { title: title.trim(), description: rest.join(":").trim() || line };
            })
          }
        : undefined
    },
    create: {
      userId,
      fullName: input.fullName,
      headline: input.headline,
      currentRole: input.currentRole,
      location: input.location,
      resumeText: input.resumeText,
      targetRoles: splitList(input.targetRoles),
      targetIndustries: splitList(input.targetIndustries),
      careerGoals: input.careerGoals,
      preferredTone: input.preferredTone as Tone,
      linkedinBio: input.linkedinBio,
      linkedinLinks: splitList(input.linkedinLinks),
      portfolioLinks: splitList(input.portfolioLinks),
      githubLinks: splitList(input.githubLinks),
      skills: { create: splitList(input.skills).map((name) => ({ name })) },
      interests: { create: splitList(input.interests).map((name) => ({ name })) },
      pastPosts: { create: splitList(input.pastPosts).map((content) => ({ content })) },
      projects: {
        create: splitList(input.projects).map((line) => {
          const [title, ...rest] = line.split(":");
          return { title: title.trim(), description: rest.join(":").trim() || line };
        })
      }
    }
  });

  await prisma.user.update({ where: { id: userId }, data: { name: profile.fullName } });
  revalidatePath("/");
  redirect("/dashboard");
}

export async function createConnectionTarget(formData: FormData) {
  const userId = await getCurrentUserId();
  const input = connectionTargetSchema.parse(Object.fromEntries(formData));

  const scores = scoreConnection(input);
  await prisma.connectionTarget.create({
    data: {
      userId,
      name: input.name,
      linkedinUrl: input.linkedinUrl || null,
      currentRole: input.currentRole,
      company: input.company,
      industry: input.industry,
      location: input.location,
      whyConnect: input.whyConnect,
      source: input.source,
      notes: input.notes,
      tags: splitList(input.tags),
      ...scores
    }
  });

  revalidatePath("/connections");
  redirect("/connections");
}

export async function updateConnectionStatus(id: string, status: ConnectionStatus) {
  const userId = await getCurrentUserId();
  await prisma.connectionTarget.updateMany({ where: { id, userId }, data: { status } });
  revalidatePath("/connections");
  revalidatePath(`/connections/${id}`);
}

export async function addCalendarIdea(formData: FormData) {
  const userId = await getCurrentUserId();
  const title = String(formData.get("title") ?? "");
  const pillar = String(formData.get("pillar") ?? "");
  if (!title.trim()) return;
  await prisma.contentCalendarItem.create({
    data: {
      userId,
      title,
      pillar,
      status: (String(formData.get("status") ?? "IDEA") as CalendarStatus) || "IDEA"
    }
  });
  revalidatePath("/content-calendar");
}

function scoreConnection(input: { currentRole?: string; industry?: string; whyConnect?: string; tags?: string; company?: string }) {
  const text = `${input.currentRole ?? ""} ${input.industry ?? ""} ${input.whyConnect ?? ""} ${input.tags ?? ""}`.toLowerCase();
  const ai = text.includes("ai") ? 12 : 0;
  const fullstack = text.includes("software") || text.includes("full") || text.includes("developer") ? 14 : 0;
  const company = input.company ? 8 : 0;
  const why = input.whyConnect && input.whyConnect.length > 20 ? 16 : 5;

  return {
    careerRelevance: Math.min(95, 55 + fullstack + ai),
    sharedInterests: Math.min(92, 45 + ai + fullstack),
    industryMatch: Math.min(94, 52 + ai + (input.industry ? 12 : 0)),
    roleRelevance: Math.min(96, 50 + fullstack + company),
    networkingValue: Math.min(93, 48 + company + why),
    personalizationScore: Math.min(90, 44 + why + (input.tags ? 10 : 0))
  };
}
