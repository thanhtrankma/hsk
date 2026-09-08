import { prisma } from "@/lib/db";
import type { Page } from "@prisma/client";

export type PageHeading = { level: string; text: string };
export type PageLink = { href: string; text: string };

export function getPageByPath(path: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { path } });
}

export function getAllPagePaths(): Promise<{ path: string }[]> {
  return prisma.page.findMany({ select: { path: true } });
}

export async function getSectionsSummary(): Promise<{ section: string; count: number }[]> {
  const rows = await prisma.page.groupBy({
    by: ["section"],
    _count: { _all: true },
  });
  return rows
    .map((r) => ({ section: r.section, count: r._count._all }))
    .sort((a, b) => b.count - a.count);
}

export function listPages(params: {
  q?: string;
  section?: string;
  skip?: number;
  take?: number;
}): Promise<Page[]> {
  const { q, section, skip = 0, take = 50 } = params;
  return prisma.page.findMany({
    where: {
      section: section || undefined,
      OR: q
        ? [
            { path: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { path: "asc" },
    skip,
    take,
  });
}

export function countPages(params: { q?: string; section?: string }): Promise<number> {
  const { q, section } = params;
  return prisma.page.count({
    where: {
      section: section || undefined,
      OR: q
        ? [
            { path: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
  });
}
