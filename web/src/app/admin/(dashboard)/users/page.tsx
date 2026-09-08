import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteUser } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink-800">Người dùng</h1>
        <span className="text-sm text-ink-500">{users.length} tài khoản</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-100 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink-100 text-xs font-bold text-ink-400 uppercase">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">HSK</th>
              <th className="px-4 py-3">XP</th>
              <th className="px-4 py-3">Streak</th>
              <th className="px-4 py-3">Gói</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-ink-50 last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-800">{u.displayName}</td>
                <td className="px-4 py-3 text-ink-500">{u.email}</td>
                <td className="px-4 py-3">{u.hskLevel}</td>
                <td className="px-4 py-3">{u.xpTotal}</td>
                <td className="px-4 py-3">{u.streakDays} ngày</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      u.membership === "premium" ? "bg-gold-100 text-gold-700" : "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {u.membership}
                  </span>
                </td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <Link href={`/admin/users/${u.id}`} className="font-bold text-brand-600 hover:underline">
                    Sửa
                  </Link>
                  <form action={deleteUser.bind(null, u.id)} className="inline">
                    <button className="font-bold text-red-600 hover:underline">Xoá</button>
                  </form>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-400">
                  Chưa có người dùng nào. Chạy <code>npm run db:seed</code> để tạo dữ liệu mẫu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
