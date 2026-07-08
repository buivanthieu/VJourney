// app/(client)/layout.tsx
import React from "react";
import Link from "next/link";
import Header from "@/components/Header"; // Import component con vừa tách ra

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER MỚI XỊN SÒ - TỰ ĐỘNG THẢ DANH MỤC THEO ĐÚNG Ý ÔNG */}
      <Header />

      {/* MAIN CONTENT - Nơi hiển thị các trang con[cite: 9] */}
      <main className="flex-grow">{children}</main> 

      {/* FOOTER - Chân trang (Giữ nguyên gốc chuẩn SEO)[cite: 9] */}
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