import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateUser } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-extrabold text-ink-800">Sửa người dùng</h1>
      <p className="mt-1 text-sm text-ink-500">{user.email}</p>

      <form action={updateUser.bind(null, user.id)} className="mt-6 space-y-4 rounded-2xl border border-ink-100 bg-white p-6">
        <div>
          <label className="block text-sm font-bold text-ink-700">Tên hiển thị</label>
          <input
            name="displayName"
            defaultValue={user.displayName}
            required
            className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-700">Cấp độ HSK</label>
            <input
              name="hskLevel"
              defaultValue={user.hskLevel}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-700">Gói thành viên</label>
            <select
              name="membership"
              defaultValue={user.membership}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            >
              <option value="free">free</option>
              <option value="premium">premium</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink-700">Tổng XP</label>
            <input
              type="number"
              name="xpTotal"
              defaultValue={user.xpTotal}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-700">Streak (ngày)</label>
            <input
              type="number"
              name="streakDays"
              defaultValue={user.streakDays}
              className="mt-1 w-full rounded-lg border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button className="w-full rounded-lg bg-brand-500 py-2 text-sm font-bold text-white hover:bg-brand-600">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
