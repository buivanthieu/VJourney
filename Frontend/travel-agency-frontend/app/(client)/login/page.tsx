// app/(client)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // Gọi tính năng đăng nhập Google
import { tourApi } from "@/lib/api";

export default function GeneralLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Hàm xử lý khi Admin điền form đăng nhập thông thường
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Gọi API Backend C# thực tế để lấy JWT Token
      const result = await tourApi.adminLogin({ username, password });

      if (result.success && result.token) {
        alert("🎉 Đăng nhập quyền Quản trị viên thành công!");
        localStorage.setItem("admin_token", result.token);
        localStorage.setItem("isAdminLoggedIn", "true");
        
        // Đẩy thẳng vào trang quản trị nội bộ
        router.push("/admin/dashboard");
      } else {
        alert(`Thất bại: ${result.message || "Sai thông tin tài khoản!"}`);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      alert(" Không thể kết nối đến máy chủ xác thực C#!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">VJOURNEY TRAVEL</h2>
          <p className="text-xs text-slate-400 mt-1">Vui lòng đăng nhập để tiếp tục trải nghiệm hệ thống</p>
        </div>

        {/* FORM DÀNH CHO QUẢN TRỊ VIÊN ADMIN */}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tài khoản</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500" placeholder="Nhập tài khoản..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-emerald-500" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs disabled:bg-slate-400"
          >
            {isSubmitting ? " Đang xác thực..." : "Đăng Nhập Quản Trị"}
          </button>
        </form>

        {/* ĐƯỜNG NGĂN CÁCH */}
        <div className="relative flex py-2 items-center text-xs text-slate-300 uppercase font-bold">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px]">Hoặc</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* NÚT ĐĂNG NHẬP GOOGLE DÀNH CHO KHÁCH HÀNG THU THẬP LEAD EMAIL */}
        <button
          onClick={() => signIn("google")}
          className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xs"
        >
          <span></span> Đăng nhập nhanh bằng Google
        </button>
      </div>
    </div>
  );
}