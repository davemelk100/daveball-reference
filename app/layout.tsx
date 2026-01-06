import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageLoader } from "@/components/page-loader"
import "@/styles/globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Major League Numbers",
  description: "Explore MLB player stats, team rosters, and league standings in real-time.",
  generator: "v0.app",
  metadataBase: new URL("https://majorleaguenumbers.com"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Major League Numbers",
    description: "Explore MLB player stats, team rosters, and league standings in real-time.",
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
    description: "Explore MLB player stats, team rosters, and league standings in real-time.",
    images: ["/mln.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
      </head>
      <body className={`font-sans antialiased min-h-screen flex flex-col`}>
        <Header />
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
