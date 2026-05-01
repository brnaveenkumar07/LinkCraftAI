import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserId() {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  const seeded = await prisma.user.findUnique({ where: { email: "brnaveenkumar1307@gmail.com" } });
  if (seeded) return seeded.id;

  const demo = await prisma.user.findUnique({ where: { email: "student@example.com" } });
  if (demo) return demo.id;

  const user = await prisma.user.create({
    data: {
      email: "demo@linkcraft.local",
      name: "Demo User"
    }
  });
  return user.id;
}

export async function getProfileContext(userId: string) {
  return prisma.userProfile.findUnique({
    where: { userId },
    include: {
      skills: true,
      interests: true,
      projects: true,
      pastPosts: true
    }
  });
}
