import { prisma } from "@/lib/db";

// There's no real auth/session in this clone (see src/lib/mock-session.ts),
// so features that need "the logged-in user" to demo real DB writes (like
// /friends) use the oldest seeded User row as a stand-in "current user".
// Swap this for your real session lookup once auth exists.
export async function getCurrentDemoUser() {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) {
    throw new Error("No users in the database yet - run `npm run db:seed` first.");
  }
  return user;
}
