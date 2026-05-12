import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "aruka?",
  description: "「あれ、この本持ってたっけ？」をすぐ確認できる書籍管理アプリ",
  appleWebApp: true,
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={`${notoSans.className}`}>
          <header className="flex justify-start items-center p-4 gap-4 h-16">
            <Toaster />
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
