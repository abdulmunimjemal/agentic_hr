import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MainNav } from "@/components/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kifiya Careers",
  description: "Career portal for Kifiya Financial Technologies 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background antialiased", inter.className)}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-primary text-white sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between py-4">
              <MainNav />
            </div>
          </header>
          
          <main className="flex-1 container py-8">{children}</main>

        </div>
      </body>
    </html>
  );
}