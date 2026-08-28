import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowly - Turn Your Company Knowledge Into An AI Support Agent",
  description: "Upload your documentation, create an AI chatbot, and embed it anywhere. Perfect for customer support, FAQs, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* suppressHydrationWarning: some browser extensions (e.g. Bitdefender) inject
          attributes like bis_skin_checked into <body> before React hydrates */}
      <body className="h-full bg-white dark:bg-black text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
