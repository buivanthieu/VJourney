// app/(admin)/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { tourApi } from "@/lib/api"; // Gọi trực tiếp từ file cấu hình của ông

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ toursCount: 0, postsCount: 0, contactsCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // GỌI ĐỒNG THỜI 3 API QUA HÀM TRUNG TÂM ĐÃ ĐƯỢC CHUẨN HÓA DTO
        const [tours, posts, contacts] = await Promise.all([
          tourApi.getAllTours(),
          tourApi.getAllPosts(),
          tourApi.getAllContacts()
        ]);

        setStats({
          toursCount: tours.length,
          postsCount: posts.length,
          contactsCount: contacts.length
        });
      } catch (err) {
        console.error("Lỗi tải thống kê tổng quan:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Lời chào */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Xin chào, ADMIN!</h1>
        <p className="text-sm text-slate-500">Chào mừng bạn trở lại hệ thống quản trị của văn phòng du lịch Vjourney.</p>
      </div>

      {/* KHỐI THỐNG KÊ REALTIME ĐỔ TỪ POSTGRES (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Tour */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-slate-500">Tổng số Tour hoạt động</span>
            <span className="text-3xl font-bold text-slate-900">{isLoading ? "..." : stats.toursCount}</span>
          </div>
          <div className="text-3xl p-3 bg-emerald-50 rounded-lg text-emerald-600">🗺️</div>
        </div>

        {/* Card Blog */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-slate-500">Bài viết & Cẩm nang</span>
            <span className="text-3xl font-bold text-slate-900">{isLoading ? "..." : stats.postsCount}</span>
          </div>
          <div className="text-3xl p-3 bg-amber-50 rounded-lg text-amber-600">📂</div>
        </div>

        {/* Card Contacts Thật (Nâng cấp từ đơn hàng giả lập) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-slate-500">Yêu cầu tư vấn (Contacts)</span>
            <span className="text-3xl font-bold text-slate-900">{isLoading ? "..." : stats.contactsCount}</span>
          </div>
          <div className="text-3xl p-3 bg-blue-50 rounded-lg text-blue-600">📞</div>
        </div>
      </div>

      {/* KHU VỰC ĐIỀU HƯỚNG NHANH */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Thao tác xử lý dữ liệu hệ thống</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/admin/dashboard/tours" 
            className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-emerald-500 hover:bg-emerald-50/10 transition-all group"
          >
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600">Quản lý kho Tour →</h3>
              <p className="text-xs text-slate-400 mt-1">Thêm lịch trình, cập nhật giá vé, điểm xuất phát của các tour du lịch.</p>
            </div>
          </Link>

          <Link 
            href="/admin/dashboard/posts" 
            className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-amber-500 hover:bg-amber-50/10 transition-all group"
          >
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-amber-600">Viết bài Cẩm nang →</h3>
              <p className="text-xs text-slate-400 mt-1">Soạn thảo văn bản chuẩn SEO, chia sẻ kinh nghiệm đi du lịch kéo traffic.</p>
            </div>
          </Link>

          {/* Hướng dẫn điều hướng nhanh sang trang xem Contacts mới làm */}
          <Link 
            href="/admin/dashboard/contacts" 
            className="p-4 border border-slate-200 rounded-lg flex flex-col justify-between hover:border-blue-500 hover:bg-blue-50/10 transition-all group sm:col-span-2 lg:col-span-1"
          >
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">Duyệt Form liên hệ →</h3>
              <p className="text-xs text-slate-400 mt-1">Xem danh sách tên, số điện thoại khách đăng ký tư vấn để gọi lại hỗ trợ.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}