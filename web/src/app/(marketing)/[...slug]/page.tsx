import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/pages";
import ScrapedContent from "@/components/ScrapedContent";

// Pages now live in Postgres and are editable from /admin/pages, so this
// route is rendered fresh on every request instead of statically exported.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string[] }> };

function pathFromSlug(slug: string[]): string {
  return "/" + slug.join("/");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageByPath(pathFromSlug(slug));
  if (!page) return {};
  return {
    title: page.title ? `${page.title} | HSKGo` : "HSKGo",
    description: page.description || undefined,
  };
}

export default async function ScrapedPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageByPath(pathFromSlug(slug));
  if (!page) notFound();

  const crumbs = page.path.split("/").filter(Boolean);

  return (
    <article className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs font-semibold text-ink-400">
        <Link href="/" className="hover:text-brand-600">
          Trang chủ
        </Link>
        {crumbs.map((crumb, i) => {
          const href = "/" + crumbs.slice(0, i + 1).join("/");
          return (
            <span key={href} className="flex items-center gap-1">
              <span>/</span>
              <Link href={href} className="capitalize hover:text-brand-600">
                {decodeURIComponent(crumb)}
              </Link>
            </span>
          );
        })}
      </nav>

      {page.title && (
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-800 sm:text-3xl">{page.title}</h1>
      )}
      {page.description && <p className="mt-2 text-ink-500">{page.description}</p>}

      <ScrapedContent className="mt-8" html={page.mainHtml} />
    </article>
  );
}
