// app/(client)/tours/page.tsx
import React from "react";
import TourCard from "@/components/TourCard";
import { tourApi } from "@/lib/api";

export default async function ToursPage() {
  // Gọi trực tiếp API từ phía Server-side của Next.js (Cực kỳ tối ưu cho SEO)
  const tours = await tourApi.getAllTours();
  console.log("Danh sách Tours từ API:", tours);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Tiêu đề trang */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Danh Sách Các Tour Du Lịch Toàn Quốc
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tìm kiếm hành trình lý tưởng của bạn với các gói tour đa dạng, chất lượng cao được đồng bộ từ hệ thống.
        </p>
      </div>

      {/* Hiển thị thông báo nếu hệ thống chưa có tour nào */}
      {tours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Hiện tại chưa có chương trình tour nào được kích hoạt hoặc hệ thống đang bảo trì.</p>
        </div>
      ) : (
        /* Grid danh sách thẻ tour lấy từ API thực */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}