import type { Metadata, Viewport } from "next";
import { AppDrawer } from "@/components/app-drawer";
import { LoginModal } from "@/components/login-modal";
import { getCurrentUser } from "@/lib/session";
import "./source.css";
import "./source-unscoped.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGENOLX",
  description: "AGENOLX rebuild",
  icons: {
    icon: "https://cdn-proxy.globalcontentcloud.com/456/logo/favicon.ico",
    apple: "https://cdn-proxy.globalcontentcloud.com/456/dist/icons/icon_512x512.21627c.png"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1d2b43"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="id">
      <body>
        {children}
        <AppDrawer user={user} />
        <LoginModal />
      </body>
    </html>
  );
}
