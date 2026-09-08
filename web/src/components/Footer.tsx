import Link from "next/link";

const COMPANY_LINKS = [
  { href: "/about", label: "Về chúng tôi" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/download", label: "Tải ứng dụng" },
  { href: "/contact", label: "Liên hệ" },
];

const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Chính sách bảo mật" },
  { href: "/legal/terms", label: "Điều khoản sử dụng" },
  { href: "/legal/complaints", label: "Tiếp nhận & giải quyết khiếu nại" },
  { href: "/legal/shipping", label: "Giao hàng" },
  { href: "/legal/refund", label: "Đổi trả & hoàn tiền" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-ink-50">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-ink-800">
            <span className="han flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
              汉
            </span>
            HSKGo
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            Nền tảng học tiếng Trung trực tuyến theo lộ trình HSK 1–9.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-ink-400 uppercase">HSKGo</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-600 hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-wide text-ink-400 uppercase">Pháp lý</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-600 hover:text-brand-600">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100 px-4 py-4 text-center text-xs text-ink-400 sm:px-6">
        © {new Date().getFullYear()} HSKGo. Nền tảng học tiếng Trung trực tuyến.
      </div>
    </footer>
  );
}
