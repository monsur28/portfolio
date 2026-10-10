import type { Metadata } from "next";
import { Bebas_Neue, Playfair_Display, Inter, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/site";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Abul Monsur - Full-Stack Developer";
const description =
  "Portfolio of Abul Monsur, a full-stack developer building high-performance web applications, scalable systems, and thoughtful interaction design.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Abul Monsur",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Font variables live on <html> so Tailwind's :root @theme tokens can resolve them.
  return (
    <html
      lang="en"
      className={cn(
        "font-sans",
        geist.variable,
        bebasNeue.variable,
        playfairDisplay.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="font-sans antialiased bg-[#0a0a0a] text-[#e8e4d9]">
        {children}
      </body>
    </html>
  );
}
