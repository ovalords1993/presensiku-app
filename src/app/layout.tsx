import type { Metadata } from "next";
import "./globals.css";
import UserMenu from "@/components/auth/UserMenu";

export const metadata: Metadata = {
  title: "Presensiku",
  description: "Multi-tenant school attendance PWA",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <div className="fixed right-4 top-4 z-50">
          <UserMenu />
        </div>
        {children}
      </body>
    </html>
  );
}
