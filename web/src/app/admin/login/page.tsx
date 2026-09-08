import LoginForm from "./LoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ink-100 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-2 font-extrabold text-ink-800">
          <span className="han flex size-8 items-center justify-center rounded-full bg-brand-500 text-white">
            汉
          </span>
          HSKGo Admin
        </div>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </div>
  );
}
