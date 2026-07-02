import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Илья Ратников — Риэлтор в Санкт-Петербурге | Комплексный подход к недвижимости",
  description:
    "Универсальный специалист по недвижимости в Санкт-Петербурге и ЛО. Покупка, продажа, сопровождение сделок, консультации по новостройкам. Партнёр Setl Group.",
  keywords: [
    "риэлтор",
    "недвижимость",
    "Санкт-Петербург",
    "купить квартиру",
    "продать квартиру",
    "новостройки",
    "сопровождение сделки",
    "Илья Ратников",
  ],
  authors: [{ name: "Илья Ратников" }],
  openGraph: {
    title: "Илья Ратников — Риэлтор в Санкт-Петербурге",
    description: "Комплексный подход к недвижимости. Покупка, продажа, сопровождение сделок.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}