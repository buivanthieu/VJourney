// app/(admin)/admin/layout.tsx
"use client"; // Chuyển sang use client để đọc được bộ nhớ localStorage của trình duyệt

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false); // Trạng thái kiểm tra quyền admin

  useEffect(() => {
    // KIỂM TRA DẤU MỘC ĐÃ ĐĂNG NHẬP TRONG TRÌNH DUYỆT
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const token = localStorage.getItem("admin_token");

    if (isLoggedIn !== "true" || !token) {
      // Nếu chưa đăng nhập hoặc không có Token, tống cổ ra trang Login ngay lập tức!
      alert("⚠️ Khu vực bảo mật nâng cao! Vui lòng đăng nhập tài khoản Admin.");
      router.push("/login");
    } else {
      // Nếu hợp lệ, cho phép mở khóa giao diện
      setIsVerified(true);
    }
  }, [router]);

  // Trong lúc hệ thống đang check thông tin, hiển thị màn hình chờ bảo mật
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent"></div>
        <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">Verifying Security Token...</p>
      </div>
    );
  }

  // NẾU HỢP LỆ - HIỂN THỊ GIAO DIỆN ADMIN NHƯ BÌNH THƯỜNG 
  return (
    <div className="flex min-h-screen bg-slate-100"> 
      {/* SIDEBAR - Menu dọc bên trái  */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full"> 
        <div className="p-5 border-b border-slate-800"> 
          <Link href="/admin/dashboard" className="text-lg font-bold tracking-wider text-emerald-400 font-black"> 
            VJOURNEY SYSTEM
          </Link> 
          <span className="block text-xs text-slate-400 mt-1">Hệ thống quản trị nội bộ</span> 
        </div>
        
        <nav className="flex-grow p-4 space-y-2 text-sm font-medium"> 
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"> 
            📊 Tổng quan hệ thống
          </Link> 
          <Link href="/admin/dashboard/tours" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"> 
            🗺️ Quản lý Tour du lịch
          </Link> 
          <Link href="/admin/dashboard/posts" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"> 
            📂 Quản lý Cẩm nang / Blog
          </Link> 
          <Link href="/admin/dashboard/contacts" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"> 
            📞 Quản lý Yêu cầu Tư vấn
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500"> 
          <button 
            onClick={() => {
              // Hàm xóa sạch dấu vết đăng nhập khi ấn thoát
              localStorage.clear();
              router.push("/login");
            }} 
            className="hover:text-rose-400 text-left w-full transition-colors"
          >
            🚪 Đăng xuất hệ thống
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - Khu vực hiển thị nội dung bên phải  */}
      <div className="flex-grow pl-64"> 
        {/* Topbar phụ  */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm"> 
          <div className="font-semibold text-slate-700">Bảng điều khiển hệ thống</div> 
          <div className="flex items-center gap-3 text-sm"> 
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> 
            <span className="text-slate-600 font-medium">ADMIN</span> 
          </div> 
        </header> 

        {/* Khung nội dung chính của từng trang Dashboard  */}
        <main className="p-8">{children}</main> 
      </div>
    </div>
  );
}