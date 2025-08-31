import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazer Projects",
  description: "Track client project health and developer updates from Slack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <h1 className="text-2xl font-bold hover:text-primary transition-colors">
                    Client Health Dashboard
                  </h1>
                </Link>
                <nav className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
