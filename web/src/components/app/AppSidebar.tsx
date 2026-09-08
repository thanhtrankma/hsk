import Link from "next/link";

type NavItem = { href: string; label: string };
type NavGroup = { heading?: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },
  {
    heading: "Học tập",
    items: [
      { href: "/beginner", label: "Người mới bắt đầu" },
      { href: "/hsk", label: "Giáo trình HSK 1-9" },
      { href: "/hsk-practice", label: "Luyện thi HSK" },
      { href: "/tocfl", label: "Luyện thi TOCFL" },
      { href: "/video", label: "Học qua video" },
    ],
  },
  {
    heading: "Từ vựng & nền tảng",
    items: [
      { href: "/vocab/my-words", label: "Sổ tay từ vựng" },
      { href: "/vocab/review", label: "Ôn tập từ vựng" },
      { href: "/vocab/mistakes", label: "Sửa lỗi sai" },
      { href: "/radicals", label: "Bộ thủ chữ Hán" },
    ],
  },
  {
    heading: "Ôn luyện & cộng đồng",
    items: [
      { href: "/practice", label: "Luyện tập tổng hợp" },
      { href: "/game", label: "Trò chơi" },
      { href: "/stories", label: "Truyện song ngữ" },
      { href: "/tools", label: "Công cụ" },
      { href: "/tutor", label: "AI Tutor" },
      { href: "/exam/history", label: "Lịch sử thi thử" },
      { href: "/leaderboard", label: "Bảng xếp hạng" },
      { href: "/friends", label: "Bạn bè" },
      { href: "/community", label: "Cộng đồng" },
    ],
  },
];

export default function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-ink-100 py-6 lg:block">
      <div className="px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-ink-800">
          <span className="han flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
            汉
          </span>
          HSKGo
        </Link>
      </div>

      <nav className="mt-6 space-y-6">
        {GROUPS.map((group, i) => (
          <div key={i} className="px-2">
            {group.heading && (
              <p className="px-2 text-[11px] font-bold tracking-wide text-ink-400 uppercase">
                {group.heading}
              </p>
            )}
            <ul className="mt-1 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-600 hover:bg-brand-50 hover:text-brand-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
