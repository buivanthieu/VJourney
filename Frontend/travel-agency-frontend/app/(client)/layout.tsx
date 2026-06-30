// app/(client)/layout.tsx
import React from "react";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER - Thanh điều hướng */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo công ty */}
          <Link href="/" className="text-xl font-bold text-emerald-600 tracking-tight">
            ORIGIN <span className="text-amber-500">TRAVEL</span>
          </Link>

          {/* Menu chính */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
            <Link href="/tours" className="hover:text-emerald-600 transition-colors">Danh sách Tour</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Về chúng tôi</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Cẩm nang du lịch</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</Link>
          </nav>

          {/* Hotline khẩn cấp (Rất quan trọng cho web dịch vụ) */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:0900123456" 
              className="hidden sm:block text-sm font-semibold text-slate-950 bg-amber-400 px-4 py-2 rounded-full hover:bg-amber-500 transition-colors"
            >
              Hotline: 090 123 456
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Nơi hiển thị các trang con */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER - Chân trang (Chuẩn SEO để Google crawl thông tin doanh nghiệp) */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Origin Travel Co., Ltd</h3>
            <p className="text-sm leading-relaxed">
              Nhà tổ chức tour du lịch chuyên nghiệp, thiết kế lịch trình riêng độc đáo, trải nghiệm chân thực.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tours" className="hover:text-white transition-colors">Tất cả Tour du lịch</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tour Miền Bắc</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Liên hệ văn phòng</h3>
            <p className="text-sm">📍 Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
            <p className="text-sm mt-1">✉️ Email: info@origintravel-sample.com</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} Origin Travel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}