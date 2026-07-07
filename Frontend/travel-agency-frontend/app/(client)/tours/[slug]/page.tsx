// app/(client)/tours/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
import { tourApi } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await tourApi.getTourBySlug(slug);

  if (!tour) return { title: "Không tìm thấy Tour - Origin Travel" };

  const plainTextDescription = tour.content ? tour.content.replace(/<[^>]*>/g, "").substring(0, 160) : "";

  return {
    title: `${tour.title} | Giá Tốt Nhất Tại Origin Travel`,
    description: plainTextDescription,
    openGraph: {
      title: tour.title,
      description: plainTextDescription,
      images: [{ url: tour.image }],
    },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = await tourApi.getTourBySlug(slug);

  if (!tour) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Rất tiếc, chương trình tour không tồn tại!</h2>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* BANNER ẢNH TOUR */}
      <div className="relative h-[350px] w-full bg-slate-900">
        <img src={tour.image} alt={tour.title} className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-5xl px-4 pb-8">
            <h1 className="text-2xl font-bold text-white sm:text-4xl leading-tight max-w-4xl">{tour.title}</h1>
          </div>
        </div>
      </div>

      {/* BỐ CỤC 2 CỘT */}
      <div className="mx-auto max-w-5xl px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: HIỂN THỊ NỘI DUNG TỪ TRÌNH SOẠN THẢO WORD (HTML) */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full min-w-0"> {/* Thêm min-w-0 để flexbox không bị phình kích thước */}
          <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
            <div><span className="block text-slate-400 text-xs">Thời gian</span><span className="font-semibold text-slate-800">🕒 {tour.duration}</span></div>
            <div><span className="block text-slate-400 text-xs">Khởi hành</span><span className="font-semibold text-slate-800">📍 {tour.startLocation}</span></div>
            <div><span className="block text-slate-400 text-xs">Vùng miền</span><span className="font-semibold text-slate-800">🗺️ {tour.location?.name || "Toàn quốc"}</span></div>
          </div>

          {/* KHU VỰC ĐỔ NỘI DUNG HTML CHI TIẾT (CHUẨN SEO) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden">
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Chi tiết chương trình & Lịch trình</h2>
            
            {/* FIX THẦN THÁNH: Thêm whitespace-normal để hóa giải &nbsp; thành dấu cách thông thường */}
            <div 
              className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4 whitespace-normal break-words"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: tour.content }} 
            />
          </div>
        </div>

        {/* CỘT PHẢI: BOX ĐẶT TOUR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col gap-4">
            <div>
              <span className="block text-sm text-slate-400">Giá trọn gói từ</span>
              <span className="text-2xl font-extrabold text-amber-600">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
              </span>
            </div>
            <a href="tel:090123456" className="block w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white text-center hover:bg-emerald-700 transition-colors shadow-md">
              Đặt Tour / Tư Vấn Ngay
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}