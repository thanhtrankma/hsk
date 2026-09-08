import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HSKGo – Học tiếng Trung online miễn phí từ HSK 1–9",
  description: "Nền tảng học tiếng Trung trực tuyến theo lộ trình HSK 1–9.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${jakarta.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink-800">{children}</body>
    </html>
  );
}
