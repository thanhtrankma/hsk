import Link from "next/link";

const NAV_LINKS = [
  { href: "/beginner", label: "Nhập môn" },
  { href: "/hsk", label: "HSK" },
  { href: "/hsk-practice", label: "Luyện HSK" },
  { href: "/exam", label: "Đề thi" },
  { href: "/tocfl", label: "TOCFL" },
  { href: "/video", label: "Video" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-ink-800">
          <span className="han flex size-9 items-center justify-center rounded-full bg-brand-500 text-lg text-white">
            汉
          </span>
          HSKGo
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-ink-600 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-brand-600">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-bold text-ink-700 hover:text-brand-600 sm:inline"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
