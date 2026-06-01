import type { ReactNode } from "react";
import "./globals.css";
import SecurityGuard from "@/components/SecurityGuard";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SecurityGuard />
      {children}
    </>
  );
}
