import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [userCount, pageCount, premiumCount, sectionCount] = await Promise.all([
    prisma.user.count(),
    prisma.page.count(),
    prisma.user.count({ where: { membership: "premium" } }),
    prisma.page.groupBy({ by: ["section"] }).then((r) => r.length),
  ]);

  const stats = [
    { label: "Người dùng", value: userCount },
    { label: "Trang nội dung", value: pageCount },
    { label: "Thành viên Premium", value: premiumCount },
    { label: "Danh mục (section)", value: sectionCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-800">Tổng quan</h1>
      <p className="mt-1 text-sm text-ink-500">Dữ liệu thật, đọc trực tiếp từ Postgres.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="text-3xl font-extrabold text-brand-600">{s.value}</div>
            <div className="mt-1 text-sm text-ink-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
