import Link from "next/link";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/pages", label: "Nội dung (Pages)" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50/40">
      <header className="flex items-center justify-between border-b border-ink-100 bg-white px-6 py-3">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 font-extrabold text-ink-800">
            <span className="han flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
              汉
            </span>
            HSKGo Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm font-semibold text-ink-600">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-600">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button className="rounded-full border border-ink-200 px-4 py-1.5 text-sm font-bold text-ink-700 hover:bg-ink-50">
            Đăng xuất
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  );
}
