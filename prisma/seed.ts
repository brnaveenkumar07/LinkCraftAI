import "dotenv/config";
import { PrismaClient, Tone } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const resumeText = `B R NAVEEN KUMAR
Bengaluru, India
Email: brnaveenkumar1307@gmail.com
Phone: 8197456715
Portfolio: https://naveen-msd.vercel.app/
GitHub: https://github.com/brnaveenkumar07
LinkedIn: https://www.linkedin.com/in/b-r-naveen-kumar-fullstackdeveloper/

Summary:
Full Stack Developer with hands-on experience in building scalable web applications using modern technologies. Skilled in both frontend and backend development, with a strong foundation in problem-solving and clean code practices. Completed internship experience at Prodigy Infotech, delivering real-world projects. Passionate about learning, optimizing performance, and creating user-focused solutions.

Core Technical Skills:
Programming: JavaScript, TypeScript, SQL, Python
Frontend: React.js, Next.js, Tailwind CSS, ShadCN
Backend & Infrastructure: Node.js, Express.js
Databases: MongoDB, SQL
Tools: Git, GitHub, Postman, VS Code, Codex

Experience:
Full Stack Developer Intern, Prodigy Infotech, Feb 2026 - Mar 2026
- Completed a hands-on internship at Prodigy Infotech, working on real-world full-stack development tasks.
- Developed and deployed multiple projects, strengthening skills in frontend and backend technologies.
- Improved problem-solving abilities by debugging and optimizing application performance.
- Collaborated on task-based projects, enhancing code quality, version control, and development workflow.

Projects:
SocialApp: Built using Next.js 16 (App Router), React 19, Prisma ORM, and PostgreSQL. Includes notifications for likes, comments, and follows.
E-Commerce: Simulates a real-world online store with browsing, checkout, order creation, and admin dashboard workflows.
Employee Management System: A modern web application designed to manage employee records securely and efficiently.`;

const projects = [
  {
    title: "SocialApp",
    description:
      "SocialApp is built using Next.js 16 (App Router), React 19, Prisma ORM, and PostgreSQL, and includes essential real-world social platform features like notifications for likes, comments, and follows.",
    link: "https://social-app-naveen.vercel.app"
  },
  {
    title: "E-Commerce",
    description:
      "Designed to simulate a real-world online store with an end-to-end shopping experience from browsing products to placing orders and managing them through an admin dashboard.",
    link: "https://ecommerce-naveen.vercel.app"
  },
  {
    title: "Employee Management System",
    description:
      "EMS is a modern web application designed to manage employee records securely and efficiently.",
    link: "https://ems-naveen.vercel.app"
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "brnaveenkumar1307@gmail.com" },
    update: {
      name: "B R NAVEEN KUMAR",
      passwordHash,
      profile: {
        upsert: {
          update: {
            fullName: "B R NAVEEN KUMAR",
            headline: "Full Stack Developer | React.js, Next.js, Node.js, Express.js",
            currentRole: "Full Stack Developer Intern at Prodigy Infotech",
            location: "Bengaluru, India",
            resumeText,
            targetRoles: ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Software Developer"],
            targetIndustries: ["Web applications", "E-commerce", "Social platforms", "Developer tools"],
            careerGoals:
              "Build a professional LinkedIn presence around full-stack projects, internship experience, clean code practices, performance optimization, and user-focused web applications.",
            preferredTone: Tone.PROFESSIONAL,
            linkedinBio:
              "Full Stack Developer with hands-on experience building scalable web applications across frontend and backend. Completed a Full Stack Developer internship at Prodigy Infotech and built projects including SocialApp, E-Commerce, and Employee Management System.",
            linkedinLinks: ["https://www.linkedin.com/in/b-r-naveen-kumar-fullstackdeveloper/"],
            portfolioLinks: ["https://naveen-msd.vercel.app/"],
            githubLinks: [
              "https://github.com/brnaveenkumar07",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_05",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_03",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_02"
            ],
            skills: { deleteMany: {}, create: [
              "JavaScript", "TypeScript", "SQL", "Python", "React.js", "Next.js", "Tailwind CSS", "ShadCN",
              "Node.js", "Express.js", "REST APIs", "MongoDB", "Prisma ORM", "PostgreSQL", "Git", "GitHub",
              "Postman", "VS Code", "Codex"
            ].map((name) => ({ name })) },
            interests: { deleteMany: {}, create: [
              "full-stack development", "scalable web applications", "frontend development", "backend development",
              "performance optimization", "clean code", "user-focused solutions", "version control"
            ].map((name) => ({ name })) },
            projects: { deleteMany: {}, create: projects },
            pastPosts: { deleteMany: {} }
          },
          create: {
            fullName: "B R NAVEEN KUMAR",
            headline: "Full Stack Developer | React.js, Next.js, Node.js, Express.js",
            currentRole: "Full Stack Developer Intern at Prodigy Infotech",
            location: "Bengaluru, India",
            resumeText,
            targetRoles: ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Software Developer"],
            targetIndustries: ["Web applications", "E-commerce", "Social platforms", "Developer tools"],
            careerGoals:
              "Build a professional LinkedIn presence around full-stack projects, internship experience, clean code practices, performance optimization, and user-focused web applications.",
            preferredTone: Tone.PROFESSIONAL,
            linkedinBio:
              "Full Stack Developer with hands-on experience building scalable web applications across frontend and backend. Completed a Full Stack Developer internship at Prodigy Infotech and built projects including SocialApp, E-Commerce, and Employee Management System.",
            linkedinLinks: ["https://www.linkedin.com/in/b-r-naveen-kumar-fullstackdeveloper/"],
            portfolioLinks: ["https://naveen-msd.vercel.app/"],
            githubLinks: [
              "https://github.com/brnaveenkumar07",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_05",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_03",
              "https://github.com/brnaveenkumar07/PRODIGY_FS_02"
            ],
            skills: { create: [
              "JavaScript", "TypeScript", "SQL", "Python", "React.js", "Next.js", "Tailwind CSS", "ShadCN",
              "Node.js", "Express.js", "REST APIs", "MongoDB", "Prisma ORM", "PostgreSQL", "Git", "GitHub",
              "Postman", "VS Code", "Codex"
            ].map((name) => ({ name })) },
            interests: { create: [
              "full-stack development", "scalable web applications", "frontend development", "backend development",
              "performance optimization", "clean code", "user-focused solutions", "version control"
            ].map((name) => ({ name })) },
            projects: { create: projects }
          }
        }
      }
    },
    create: {
      email: "brnaveenkumar1307@gmail.com",
      name: "B R NAVEEN KUMAR",
      passwordHash,
      profile: {
        create: {
          fullName: "B R NAVEEN KUMAR",
          headline: "Full Stack Developer | React.js, Next.js, Node.js, Express.js",
          currentRole: "Full Stack Developer Intern at Prodigy Infotech",
          location: "Bengaluru, India",
          resumeText,
          targetRoles: ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Software Developer"],
          targetIndustries: ["Web applications", "E-commerce", "Social platforms", "Developer tools"],
          careerGoals:
            "Build a professional LinkedIn presence around full-stack projects, internship experience, clean code practices, performance optimization, and user-focused web applications.",
          preferredTone: Tone.PROFESSIONAL,
          linkedinBio:
            "Full Stack Developer with hands-on experience building scalable web applications across frontend and backend. Completed a Full Stack Developer internship at Prodigy Infotech and built projects including SocialApp, E-Commerce, and Employee Management System.",
          linkedinLinks: ["https://www.linkedin.com/in/b-r-naveen-kumar-fullstackdeveloper/"],
          portfolioLinks: ["https://naveen-msd.vercel.app/"],
          githubLinks: [
            "https://github.com/brnaveenkumar07",
            "https://github.com/brnaveenkumar07/PRODIGY_FS_05",
            "https://github.com/brnaveenkumar07/PRODIGY_FS_03",
            "https://github.com/brnaveenkumar07/PRODIGY_FS_02"
          ],
          skills: { create: [
            "JavaScript", "TypeScript", "SQL", "Python", "React.js", "Next.js", "Tailwind CSS", "ShadCN",
            "Node.js", "Express.js", "REST APIs", "MongoDB", "Prisma ORM", "PostgreSQL", "Git", "GitHub",
            "Postman", "VS Code", "Codex"
          ].map((name) => ({ name })) },
          interests: { create: [
            "full-stack development", "scalable web applications", "frontend development", "backend development",
            "performance optimization", "clean code", "user-focused solutions", "version control"
          ].map((name) => ({ name })) },
          projects: { create: projects }
        }
      }
    }
  });

  await prisma.connectionTarget.deleteMany({ where: { userId: user.id } });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
