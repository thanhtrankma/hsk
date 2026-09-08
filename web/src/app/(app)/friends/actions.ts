"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentDemoUser } from "@/lib/current-user";

export async function sendFriendRequest(targetUserId: string) {
  const me = await getCurrentDemoUser();
  if (targetUserId === me.id) return;
  await prisma.friendship.upsert({
    where: { requesterId_addresseeId: { requesterId: me.id, addresseeId: targetUserId } },
    create: { requesterId: me.id, addresseeId: targetUserId, status: "pending" },
    update: {},
  });
  revalidatePath("/friends");
}

export async function acceptFriendRequest(friendshipId: string) {
  await prisma.friendship.update({ where: { id: friendshipId }, data: { status: "accepted" } });
  revalidatePath("/friends");
}

export async function removeFriendship(friendshipId: string) {
  await prisma.friendship.delete({ where: { id: friendshipId } });
  revalidatePath("/friends");
}
