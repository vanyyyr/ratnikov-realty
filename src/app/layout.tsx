import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
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
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23111a2e'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='19' fill='%23c45d3e' text-anchor='middle' font-style='italic'%3ER%3C/text%3E%3C/svg%3E",
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
        className={`${inter.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground font-sans`}
      >
        <I18nProvider>
          {children}
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}