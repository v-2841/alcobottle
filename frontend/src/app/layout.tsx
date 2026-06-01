import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AgeGate } from "@/components/AgeGate";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Alcobottle — премиальный алкоголь с доставкой",
    template: "%s — Alcobottle",
  },
  description:
    "Каталог премиального алкоголя Alcobottle: виски, коньяк и шампанское. " +
    "Подбор по категориям и производителям, доставка по Москве и области.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jivoId = process.env.JIVO_WIDGET_ID;
  return (
    <html lang="ru" className={inter.variable}>
      <body className="min-h-screen bg-cream text-ink">
        {children}
        <AgeGate />
        {/* Чат Jivo — грузим в простое браузера (реком. next/script для чат-виджетов) */}
        {jivoId && (
          <Script
            src={`https://code.jivo.ru/widget/${jivoId}`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
