import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazirmatn",
});

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
    <html lang="ar" dir="rtl" className={vazirmatn.variable}>
      <body className="font-sans antialiased">
        <NextTopLoader
          color="#15803d"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #15803d,0 0 5px #15803d"
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}