import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "PEMULABET Admin",
  description: "PEMULABET admin control panel"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
