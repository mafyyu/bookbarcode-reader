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

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    title: "aruka?",
    statusBarStyle: "black-translucent",
  },

  themeColor: "#51A25E",

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
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
        <body className={notoSans.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
