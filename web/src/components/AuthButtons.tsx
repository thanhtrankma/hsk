import Link from "next/link";

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-3">
      <Link href="/login" className="hidden text-sm font-extrabold text-ink-700 hover:text-brand-600 sm:inline">
        Đăng nhập
      </Link>
      <Link href="/register" className="btn-primary">
        Đăng ký
      </Link>
    </div>
  );
}
