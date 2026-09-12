"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; active: boolean };
type NavGroup = { heading?: string; items: NavItem[] };

// `active` = genuinely usable right now (real data, real interactivity, or
// substantial real content) vs a mock shell / honest "not built yet" stub /
// decorative scraped snapshot that doesn't reflect real state in this app
// (see README's "UI-only shells" vs "real features" split, plus /video and
// /leaderboard which have no real backing data of their own). Items are
// sorted active-first within each group so what actually works surfaces
// immediately; inactive ones stay reachable (nothing here 404s) but are
// visually muted with a "Sắp có" tag instead of looking broken.
const RAW_GROUPS: NavGroup[] = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard", active: false },
      { href: "/download", label: "Tải ứng dụng", active: false },
    ],
  },
  {
    heading: "Học tập",
    items: [
      { href: "/beginner", label: "Người mới bắt đầu", active: true },
      { href: "/hsk", label: "Giáo trình HSK 1-9", active: true },
      { href: "/hsk-practice", label: "Bài tập", active: true },
      { href: "/exam", label: "Luyện thi HSK", active: true },
      { href: "/tocfl", label: "Luyện thi TOCFL", active: true },
      { href: "/video", label: "Học qua video", active: false },
    ],
  },
  {
    heading: "Từ vựng & nền tảng",
    items: [
      { href: "/vocab/topics", label: "Từ vựng theo chủ đề", active: true },
      { href: "/radicals", label: "Bộ thủ chữ Hán", active: true },
      { href: "/vocab/my-words", label: "Sổ tay từ vựng", active: false },
      { href: "/vocab/review", label: "Ôn tập từ vựng", active: false },
      { href: "/vocab/mistakes", label: "Sửa lỗi sai", active: false },
    ],
  },
  {
    heading: "Ôn luyện & cộng đồng",
    items: [
      { href: "/practice", label: "Luyện tập tổng hợp", active: true },
      { href: "/game", label: "Trò chơi", active: true },
      { href: "/tools", label: "Công cụ", active: true },
      { href: "/friends", label: "Bạn bè", active: true },
      { href: "/stories", label: "Truyện song ngữ", active: true },
      { href: "/materials", label: "Tài liệu học tập", active: true },
      { href: "/blog", label: "Bài viết", active: true },
      { href: "/partners", label: "Hợp tác", active: true },
      { href: "/tutor", label: "AI Tutor", active: false },
      { href: "/exam/history", label: "Lịch sử thi thử", active: false },
      { href: "/leaderboard", label: "Bảng xếp hạng", active: false },
      { href: "/profile", label: "Cài đặt", active: false },
    ],
  },
];

const GROUPS: NavGroup[] = RAW_GROUPS.map((group) => ({
  ...group,
  items: [...group.items].sort((a, b) => Number(b.active) - Number(a.active)),
}));

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6 px-2 py-4">
      {GROUPS.map((group, i) => (
        <div key={i}>
          {group.heading && (
            <p className="px-2 text-[11px] font-bold tracking-wide text-ink-400 uppercase">{group.heading}</p>
          )}
          <ul className={group.heading ? "mt-1 space-y-0.5" : "space-y-0.5"}>
            {group.items.map((item) => {
              const current = pathname === item.href;
              let className: string;
              if (current) {
                className = "flex items-center justify-between rounded-lg bg-brand-50 px-2 py-1.5 text-sm font-semibold text-brand-600";
              } else if (item.active) {
                className =
                  "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-ink-600 hover:bg-brand-50 hover:text-brand-600";
              } else {
                className =
                  "flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium text-ink-300 hover:bg-ink-50 hover:text-ink-400";
              }
              return (
                <li key={item.href}>
                  <Link href={item.href} onClick={onNavigate} aria-current={current ? "page" : undefined} className={className}>
                    <span>{item.label}</span>
                    {!item.active && (
                      <span className="shrink-0 rounded-full bg-ink-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-ink-400 uppercase">
                        Sắp có
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto border-r border-ink-100 bg-white lg:block">
        <NavContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-ink-900/40"
            onClick={onClose}
          />
          <aside className="absolute top-0 left-0 h-full w-72 overflow-y-auto bg-white shadow-xl">
            <NavContent onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
