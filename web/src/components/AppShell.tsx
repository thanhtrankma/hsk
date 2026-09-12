"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({
  headerRight,
  footer,
  children,
}: {
  headerRight: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-4 border-b border-ink-100 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-50 lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2 font-extrabold text-ink-800">
            <span className="han flex size-9 items-center justify-center rounded-full bg-brand-500 text-lg text-white">
              汉
            </span>
            HSKGo
          </Link>
        </div>

        {headerRight}
      </header>

      <div className="flex flex-1">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1">{children}</main>
          {footer}
        </div>
      </div>
    </div>
  );
}
