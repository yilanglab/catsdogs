import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "猫人狗人 · 发现你的隐藏动物人格",
  description: "15道情境题，从能量、策略、内核三个维度，定位你的隐藏动物人格。你是哪种猫系或犬系？",
  keywords: ["人格测试", "猫人", "狗人", "动物人格", "性格测试", "MBTI"],
  openGraph: {
    title: "猫人狗人 · 发现你的隐藏动物人格",
    description: "15道情境题，找到你的隐藏动物人格",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "猫人狗人 · 发现你的隐藏动物人格",
    description: "15道情境题，找到你的隐藏动物人格",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
