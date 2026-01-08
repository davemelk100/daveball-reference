import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageLoader } from "@/components/page-loader";
import { WebsiteJsonLd } from "@/components/json-ld";
import { Toaster } from "@/components/ui/sonner"
import "@/styles/globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Major League Numbers",
    template: "%s | Major League Numbers",
  },
  description:
    "Explore MLB player stats, team rosters, and league standings in real-time.",
  generator: "v0.app",
  metadataBase: new URL("https://majorleaguenumbers.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: [
    "MLB",
    "baseball",
    "statistics",
    "player stats",
    "team rosters",
    "standings",
    "Major League Baseball",
    "baseball reference",
  ],
  authors: [{ name: "Major League Numbers" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Major League Numbers",
    description:
      "Explore MLB player stats, team rosters, and league standings in real-time.",
    url: "https://majorleaguenumbers.com",
    siteName: "Major League Numbers",
    images: [
      {
        url: "/mln.png",
        width: 1200,
        height: 630,
        alt: "Major League Numbers - MLB Statistics Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Major League Numbers",
    description:
      "Explore MLB player stats, team rosters, and league standings in real-time.",
    images: ["/mln.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <WebsiteJsonLd />
      </head>
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
