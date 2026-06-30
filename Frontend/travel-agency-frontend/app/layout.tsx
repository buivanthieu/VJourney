// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

// Cấu hình SEO mặc định cho toàn bộ website
export const metadata: Metadata = {
  title: "Công Ty Du Lịch Chất Lượng - Tour Giá Tốt",
  description: "Chuyên cung cấp các tour du lịch trong và ngoài nước thiết kế riêng, uy tín, chất lượng cao.",
  metadataBase: new URL("https://your-domain.com"), // Thay bằng tên miền sau này của bạn
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}