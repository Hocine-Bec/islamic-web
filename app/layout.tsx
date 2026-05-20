import type { Metadata } from "next";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "أبو العباس محمد رحيل بن إسماعيل",
  description: "دروس ومحاضرات إسلامية",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}