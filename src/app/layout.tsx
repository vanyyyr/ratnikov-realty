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
  metadataBase: new URL("https://ratnikov.spb.ru"),
  title: "Илья Ратников — Риэлтор в Санкт-Петербурге",
  description:
    "Покупка, продажа и оценка недвижимости в Санкт-Петербурге. Сопровождение сделок, новостройки со скидкой от Setl Group.",
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
    description: "Риэлтор в Санкт-Петербурге. Покупка, продажа, сопровождение сделок.",
    type: "website",
    url: "https://ratnikov.spb.ru",
    images: [
      {
        url: "/hero-photo.jpg",
        width: 896,
        height: 1195,
        alt: "Илья Ратников — Риэлтор в Санкт-Петербурге",
      },
    ],
    locale: "ru_RU",
    siteName: "Ратников Недвижимость",
  },
  twitter: {
    card: "summary_large_image",
    title: "Илья Ратников — Риэлтор в Санкт-Петербурге",
    description: "Риэлтор в Санкт-Петербурге. Покупка, продажа, сопровождение сделок.",
    images: ["/hero-photo.jpg"],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🏠%3C/text%3E%3C/svg%3E",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Илья Ратников",
  description: "Риэлтор в Санкт-Петербурге. Покупка, продажа, сопровождение сделок с недвижимостью.",
  url: "https://ratnikov.spb.ru",
  telephone: "+79892467798",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Комсомола, 41",
    addressLocality: "Санкт-Петербург",
    addressCountry: "RU",
  },
  areaServed: {
    "@type": "City",
    name: "Санкт-Петербург",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/hero-photo.jpg" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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