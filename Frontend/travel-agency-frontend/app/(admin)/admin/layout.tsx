// app/(admin)/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  // Trạng thái mở/đóng Sidebar trên màn hình di động
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const token = localStorage.getItem("admin_token");

    if (isLoggedIn !== "true" || !token) {
      alert("⚠️ Khu vực bảo mật nâng cao! Vui lòng đăng nhập tài khoản Admin.");
      router.push("/login");
    } else {
      setIsVerified(true);
    }
  }, [router]);

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Verifying Security Token...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 relative"> 
      
      {/* 1. LỚP PHỦ MỜ KHI MỞ MENU TRÊN MOBILE (BACKDROP) */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* 2. SIDEBAR RESPONSIVE */}
      <aside 
        className={`
          w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      > 
        <div className="p-5 border-b border-slate-800 flex items-center justify-between"> 
          <div>
            <Link href="/admin/dashboard" className="text-lg font-bold tracking-wider text-emerald-400 font-black"> 
              VJOURNEY SYSTEM
            </Link> 
            <span className="block text-xs text-slate-400 mt-1">Hệ thống quản trị nội bộ</span> 
          </div>
          {/* Nút X tắt Sidebar trên mobile */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1 text-lg font-bold"
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 text-sm font-medium overflow-y-auto"> 
          <Link 
            href="/admin/dashboard" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          > 
            📊 Tổng quan hệ thống
          </Link> 
          <Link 
            href="/admin/dashboard/tours" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          > 
            🗺️ Quản lý Tour du lịch
          </Link> 
          <Link 
            href="/admin/dashboard/posts" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          > 
            📂 Quản lý Cẩm nang / Blog
          </Link> 
          <Link 
            href="/admin/dashboard/contacts" 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          > 
            📞 Quản lý Yêu cầu Tư vấn
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500"> 
          <button 
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }} 
            className="hover:text-rose-400 text-left w-full transition-colors flex items-center gap-2"
          >
            🚪 Đăng xuất hệ thống
          </button>
        </div>
      </aside>

      {/* 3. KHU VỰC NỘI DUNG CHÍNH (MAIN CONTENT AREA) */}
      {/* pl-0 cho Mobile để full width, pl-64 cho PC (md:) */}
      <div className="flex-grow pl-0 md:pl-64 w-full min-w-0"> 
        
        {/* Topbar phụ */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-xs sticky top-0 z-30"> 
          <div className="flex items-center gap-3">
            {/* Nút 3 gạch mở Sidebar trên mobile */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg outline-none"
            >
              <span className="text-xl font-bold">☰</span>
            </button>
            <div className="font-semibold text-slate-700 text-sm sm:text-base">Bảng điều khiển</div> 
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"> 
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            <span className="text-slate-600 font-bold">ADMIN</span> 
          </div> 
        </header> 

        {/* Khung hiển thị Dashboard */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main> 
      </div>
    </div>
  );
}