import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Get Ready AI — AI photo studio for skin, hair, and try-on",
  description:
    "All-in-one AI fashion and beauty studio. Retouch skin, restyle hair, and try on outfits from a single photo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        playfair.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
