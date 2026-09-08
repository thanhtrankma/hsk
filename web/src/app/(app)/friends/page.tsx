import { prisma } from "@/lib/db";
import { getCurrentDemoUser } from "@/lib/current-user";
import { sendFriendRequest, acceptFriendRequest, removeFriendship } from "./actions";

export const dynamic = "force-dynamic";

function initial(name: string) {
  return name.charAt(0).toUpperCase();
}

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = "friends", q = "" } = await searchParams;
  const me = await getCurrentDemoUser();

  const [sent, received, allUsers] = await Promise.all([
    prisma.friendship.findMany({ where: { requesterId: me.id }, include: { addressee: true } }),
    prisma.friendship.findMany({ where: { addresseeId: me.id }, include: { requester: true } }),
    prisma.user.findMany({ where: { id: { not: me.id } } }),
  ]);

  const friends = [
    ...sent.filter((f) => f.status === "accepted").map((f) => ({ friendshipId: f.id, user: f.addressee })),
    ...received.filter((f) => f.status === "accepted").map((f) => ({ friendshipId: f.id, user: f.requester })),
  ];
  const incomingRequests = received.filter((f) => f.status === "pending");
  const connectedIds = new Set([
    ...sent.map((f) => f.addresseeId),
    ...received.map((f) => f.requesterId),
  ]);
  const suggestions = allUsers.filter((u) => !connectedIds.has(u.id));
  const searchResults = q.trim()
    ? allUsers.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()),
      )
    : [];

  const TABS = [
    { key: "friends", label: `Bạn bè (${friends.length})` },
    { key: "requests", label: `Lời mời (${incomingRequests.length})` },
    { key: "suggestions", label: "Gợi ý" },
    { key: "search", label: "Tìm bạn" },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-ink-800">Bạn bè</h1>
      <p className="mt-1 text-sm text-ink-500">
        Kết nối, theo dõi tiến độ và nhắc nhau cùng học mỗi ngày. Đang xem với tư cách{" "}
        <strong>{me.displayName}</strong> (tài khoản demo đầu tiên trong DB).
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-b border-ink-100 pb-3">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={`?tab=${t.key}`}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              tab === t.key ? "bg-brand-500 text-white" : "bg-ink-100 text-ink-600"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {tab === "friends" &&
          (friends.length ? (
            friends.map(({ friendshipId, user }) => (
              <div key={friendshipId} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                  {initial(user.displayName)}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-ink-800">{user.displayName}</p>
                  <p className="text-xs text-ink-500">
                    {user.hskLevel} · {user.xpTotal} XP
                  </p>
                </div>
                <form action={removeFriendship.bind(null, friendshipId)}>
                  <button className="text-sm font-bold text-red-600 hover:underline">Huỷ kết bạn</button>
                </form>
              </div>
            ))
          ) : (
            <EmptyState text='Chưa có bạn bè nào. Sang tab "Tìm bạn" để kết nối với người học khác.' />
          ))}

        {tab === "requests" &&
          (incomingRequests.length ? (
            incomingRequests.map((f) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-gold-100 font-bold text-gold-700">
                  {initial(f.requester.displayName)}
                </span>
                <div className="flex-1">
                  <p className="font-bold text-ink-800">{f.requester.displayName}</p>
                  <p className="text-xs text-ink-500">muốn kết bạn với bạn</p>
                </div>
                <form action={acceptFriendRequest.bind(null, f.id)}>
                  <button className="rounded-full bg-brand-500 px-3 py-1.5 text-xs font-bold text-white">
                    Chấp nhận
                  </button>
                </form>
                <form action={removeFriendship.bind(null, f.id)}>
                  <button className="text-xs font-bold text-ink-400 hover:underline">Từ chối</button>
                </form>
              </div>
            ))
          ) : (
            <EmptyState text="Không có lời mời kết bạn nào." />
          ))}

        {tab === "suggestions" &&
          (suggestions.length ? (
            suggestions.map((u) => <SuggestionRow key={u.id} user={u} />)
          ) : (
            <EmptyState text="Bạn đã kết nối với tất cả tài khoản demo hiện có." />
          ))}

        {tab === "search" && (
          <>
            <form className="flex gap-2">
              <input type="hidden" name="tab" value="search" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Tìm theo tên hoặc email..."
                className="flex-1 rounded-lg border border-ink-200 px-3 py-2 text-sm"
              />
              <button className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-bold text-ink-700">
                Tìm
              </button>
            </form>
            <div className="space-y-3 pt-2">
              {q && searchResults.length === 0 && <EmptyState text={`Không tìm thấy "${q}".`} />}
              {searchResults.map((u) => (
                <SuggestionRow key={u.id} user={u} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-8 text-center text-sm text-ink-400">{text}</div>
  );
}

function SuggestionRow({ user }: { user: { id: string; displayName: string; hskLevel: string; xpTotal: number } }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4">
      <span className="flex size-10 items-center justify-center rounded-full bg-jade-100 font-bold text-jade-700">
        {initial(user.displayName)}
      </span>
      <div className="flex-1">
        <p className="font-bold text-ink-800">{user.displayName}</p>
        <p className="text-xs text-ink-500">
          {user.hskLevel} · {user.xpTotal} XP
        </p>
      </div>
      <form action={sendFriendRequest.bind(null, user.id)}>
        <button className="rounded-full border border-brand-300 px-3 py-1.5 text-xs font-bold text-brand-600">
          + Kết bạn
        </button>
      </form>
    </div>
  );
}
