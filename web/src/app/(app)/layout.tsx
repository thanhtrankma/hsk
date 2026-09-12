import AppShell from "@/components/AppShell";
import AccountMenu from "@/components/app/AccountMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell headerRight={<AccountMenu />}>
      <div className="bg-ink-50/40 p-4 sm:p-6">{children}</div>
    </AppShell>
  );
}
