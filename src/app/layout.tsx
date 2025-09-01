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
                <Link
                  href="/"
                  className="flex space-x-2 justify-start max-w-32"
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 807 262"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M243.48 236V44.74H278.85V236H243.48Z"
                      fill="black"
                    ></path>
                    <path
                      d="M361.863 239.406C324.397 239.406 294.529 207.704 294.529 168.404C294.529 129.104 324.397 96.878 361.863 96.878C385.443 96.878 397.757 106.572 405.093 121.244V99.76H440.201V236H405.879V213.73C398.543 229.188 386.229 239.406 361.863 239.406ZM329.899 168.142C329.899 188.84 345.095 207.442 367.627 207.442C390.945 207.442 405.879 189.626 405.879 168.404C405.879 147.182 390.945 128.842 367.627 128.842C345.095 128.842 329.899 146.92 329.899 168.142Z"
                      fill="black"
                    ></path>
                    <path
                      d="M454.404 236V232.07L514.14 137.488C515.974 134.606 518.07 131.986 520.428 129.104H457.286V99.76H574.662V103.69L514.402 199.844C513.092 202.202 511.258 204.298 509.424 206.656H573.352V236H454.404Z"
                      fill="black"
                    ></path>
                    <path
                      d="M644.406 239.406C602.224 239.406 573.927 207.442 573.927 168.142C573.927 128.842 603.534 96.354 644.406 96.354C685.278 96.354 713.573 128.842 713.573 168.142C713.573 172.072 713.312 176.264 712.526 180.718H610.607C614.537 196.7 626.59 207.966 644.406 207.966C659.602 207.966 671.392 200.106 677.68 189.626L705.19 210.324C694.186 227.354 671.392 239.406 644.406 239.406ZM610.607 154.256H677.942C674.012 139.06 661.173 126.746 643.881 126.746C627.113 126.746 614.537 138.012 610.607 154.256Z"
                      fill="black"
                    ></path>
                    <path
                      d="M729.101 236V99.76H763.423V125.698C768.139 106.048 782.025 95.306 805.605 96.616V129.89H800.627C780.191 129.89 764.471 143.514 764.471 166.308V236H729.101Z"
                      fill="black"
                    ></path>
                    <path
                      d="M193 236H0L61.4096 45H128.959L193 236Z"
                      fill="#FF00C5"
                    ></path>
                  </svg>
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
