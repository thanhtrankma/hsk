import AppShell from "@/components/AppShell";
import AuthButtons from "@/components/AuthButtons";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell headerRight={<AuthButtons />} footer={<Footer />}>
      {children}
    </AppShell>
  );
}
