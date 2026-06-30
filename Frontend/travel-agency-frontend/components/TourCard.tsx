// components/TourCard.tsx
import React from "react";
import Link from "next/link";

// Định nghĩa kiểu dữ liệu cho một Tour (giống như DTO trong C#)
export interface TourItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  startLocation: string;
  price: number;
  category: string;
}

interface TourCardProps {
  tour: TourItem;
}

export default function TourCard({ tour }: TourCardProps) {
  // Hàm định dạng tiền tệ VND (Ví dụ: 3500000 -> 3.500.000 ₫)
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Khung chứa ảnh tour */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={tour.image}
          alt={tour.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
          {tour.category}
        </span>
      </div>

      {/* Nội dung thông tin tour */}
      <div className="p-4 flex flex-col justify-between h-52">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span>🕒 {tour.duration}</span>
            <span>📍 Khởi hành: {tour.startLocation}</span>
          </div>
          <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            <Link href={`/tours/${tour.slug}`}>
              {tour.title}
            </Link>
          </h3>
        </div>

        {/* Phần giá tiền và nút chi tiết */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-xs text-slate-400">Giá từ</span>
            <span className="text-lg font-bold text-amber-600">{formatPrice(tour.price)}</span>
          </div>
          <Link
            href={`/tours/${tour.slug}`}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}