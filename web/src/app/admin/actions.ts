"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, checkPassword, createSessionToken } from "@/lib/admin-auth";
import type { Membership } from "@prisma/client";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!checkPassword(password)) {
    return { error: "Sai mật khẩu." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// --- Users ---------------------------------------------------------------

export async function updateUser(id: string, formData: FormData) {
  await prisma.user.update({
    where: { id },
    data: {
      displayName: String(formData.get("displayName") ?? ""),
      hskLevel: String(formData.get("hskLevel") ?? "HSK 1"),
      xpTotal: Number(formData.get("xpTotal") ?? 0),
      streakDays: Number(formData.get("streakDays") ?? 0),
      membership: (String(formData.get("membership") ?? "free") as Membership),
    },
  });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// --- Pages -----------------------------------------------------------------

export async function updatePage(id: string, formData: FormData) {
  const path = String(formData.get("path") ?? "").trim();
  await prisma.page.update({
    where: { id },
    data: {
      path,
      section: String(formData.get("section") ?? "").trim(),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      mainHtml: String(formData.get("mainHtml") ?? ""),
    },
  });
  revalidatePath("/admin/pages");
  revalidatePath(path);
  redirect("/admin/pages");
}

export async function createPage(formData: FormData) {
  const path = String(formData.get("path") ?? "").trim();
  const page = await prisma.page.create({
    data: {
      path,
      section: String(formData.get("section") ?? "").trim(),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      mainHtml: String(formData.get("mainHtml") ?? ""),
      headings: [],
      internalLinks: [],
    },
  });
  revalidatePath("/admin/pages");
  revalidatePath(path);
  redirect(`/admin/pages/${page.id}`);
}

export async function deletePage(id: string) {
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath(page.path);
}
