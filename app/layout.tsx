import type { Metadata, Viewport } from "next";
import { AppDrawer } from "@/components/app-drawer";
import { LoginModal } from "@/components/login-modal";
import { getCurrentUser } from "@/lib/session";
import "./source.css";
import "./source-unscoped.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PEMULABET",
  description: "PEMULABET",
  icons: {
    icon: [{ url: "/fav-pemula-bet.webp", type: "image/webp" }],
    shortcut: [{ url: "/fav-pemula-bet.webp", type: "image/webp" }],
    apple: [{ url: "/fav-pemula-bet.webp", type: "image/webp" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f2f1f"
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
