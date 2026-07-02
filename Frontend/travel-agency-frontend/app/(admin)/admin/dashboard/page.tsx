// app/(admin)/admin/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { tourApi } from "@/lib/api";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({ toursCount: 0, postsCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Gọi đồng thời cả 2 API để lấy số lượng tổng quan
        const [tours, resPosts] = await Promise.all([
          tourApi.getAllTours(),
          fetch(`${API_URL}/posts`)
        ]);

        let postsCount = 0;
        if (resPosts.ok) {
          const postsData = await resPosts.json();
          postsCount = postsData.length;
        }

        setStats({
          toursCount: tours.length,
          postsCount: postsCount
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
        <h1 className="text-2xl font-bold text-slate-900">Xin chào, Bùi Văn Thiều!</h1>
        <p className="text-sm text-slate-500">Chào mừng bạn trở lại hệ thống quản trị của văn phòng du lịch.</p>
      </div>

      {/* KHỐI THỐNG KÊ NHANH (CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Tour */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-slate-500">Tổng số Tour</span>
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

        {/* Card Đơn hàng giả lập (Phát triển sau) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-slate-500">Đơn đặt tour mới</span>
            <span className="text-3xl font-bold text-slate-900">0</span>
          </div>
          <div className="text-3xl p-3 bg-blue-50 rounded-lg text-blue-600">🛒</div>
        </div>
      </div>

      {/* KHU VỰC ĐIỀU HƯỚNG NHANH */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4">Thao tác xử lý dữ liệu nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </div>
    </div>
  );
}