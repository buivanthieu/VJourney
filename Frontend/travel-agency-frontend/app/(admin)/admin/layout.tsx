// app/(admin)/admin/layout.tsx
import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* SIDEBAR - Menu dọc bên trái */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-800">
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-wider text-emerald-400">
            ORIGIN SYSTEM
          </Link>
          <span className="block text-xs text-slate-400 mt-1">Hệ thống quản trị nội bộ</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 text-sm font-medium">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800 text-white transition-colors"
          >
            🗺️ Quản lý Tour du lịch
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            📂 Quản lý Danh mục
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            🛒 Quản lý Đơn đặt tour
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300">← Quay lại Trang chủ khách</Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - Khu vực hiển thị nội dung bên phải */}
      <div className="flex-grow pl-64">
        {/* Topbar phụ */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="font-semibold text-slate-700">Bảng điều khiển</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 font-medium">Admin: Bùi Văn Thiều</span>
          </div>
        </header>

        {/* Khung nội dung chính của từng trang Dashboard */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}