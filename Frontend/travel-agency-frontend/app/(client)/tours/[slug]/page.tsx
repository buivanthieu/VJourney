// app/(client)/tours/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
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

  // Bốc thêm danh sách tất cả tour và bài viết từ .NET Backend để làm phần Đề xuất
  const [allTours, allPosts] = await Promise.all([
    tourApi.getAllTours(),
    tourApi.getAllPosts()
  ]);

  if (!tour) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Rất tiếc, chương trình tour không tồn tại!</h2> 
      </div>
    );
  }

  // LỌC TOUR LIÊN QUAN: Lấy các tour cùng LocationId (bỏ tour hiện tại đang xem), giới hạn lấy 3 tour
  const relatedTours = allTours
    .filter((t: any) => t.locationId === tour.locationId && t.id !== tour.id)
    .slice(0, 3);

  // Nếu không đủ tour cùng địa điểm, lấy thêm các tour mới nhất cho đầy đặn Sidebar
  if (relatedTours.length < 3) {
    const extraTours = allTours.filter((t: any) => t.id !== tour.id && !relatedTours.some((rt: any) => rt.id === t.id));
    relatedTours.push(...extraTours.slice(0, 3 - relatedTours.length));
  }

  // GỢI Ý CẨM NANG: Lấy 3 bài viết blog mới nhất để khách đọc thêm kinh nghiệm ăn chơi
  const hotPosts = allPosts.slice(0, 3);

  return (
    <div className="pb-16">
      {/* BANNER ẢNH TOUR */}
      <div className="relative h-[350px] w-full bg-slate-900">
        <img src={tour.image} alt={tour.title} className="h-full w-full object-cover opacity-60"/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" /> 
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white sm:text-4xl leading-tight max-w-4xl">{tour.title}</h1> 
          </div>
        </div>
      </div>

      {/* BỐ CỤC 2 CỘT CHUẨN ĐẸP */}
      <div className="mx-auto max-w-7xl px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:px-6 lg:px-8">
        
        {/* CỘT TRÁI (CHIẾM 2/3): THÔNG TIN LỊCH TRÌNH CHI TIẾT */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full min-w-0"> 
          <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm"> 
            <div><span className="block text-slate-400 text-xs">Thời gian</span><span className="font-semibold text-slate-800">🕒 {tour.duration}</span></div> 
            <div><span className="block text-slate-400 text-xs">Khởi hành</span><span className="font-semibold text-slate-800">📍 {tour.startLocation}</span></div> 
            <div><span className="block text-slate-400 text-xs">Vùng miền</span><span className="font-semibold text-slate-800">🗺️ {tour.locationName || "Toàn quốc"}</span></div>{/* Ăn theo DTO phẳng */}
          </div>

          {/* KHU VỰC ĐỔ NỘI DUNG HTML CHI TIẾT (CHUẨN SEO CHỐNG VỠ CHỮ) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full overflow-hidden"> 
            <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Chi tiết chương trình & Lịch trình</h2> 
            
            <div 
              className="prose max-w-none text-slate-600 text-sm leading-relaxed space-y-4 break-words whitespace-normal
                prose-img:max-w-full prose-img:h-auto 
                prose-table:w-full prose-table:overflow-x-auto block"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }} 
              dangerouslySetInnerHTML={{ __html: tour.content }} 
            />
          </div>
        </div>

        {/* CỘT PHẢI (CHIẾM 1/3): BOX ĐẶT VÀ SIDEBAR ĐỀ XUẤT THÔNG MINH */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* BOX ĐẶT TOUR CHÍNH */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center flex flex-col gap-4"> 
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

          {/* MỤC 1 BỔ SUNG: KHỐI TOUR DU LỊCH LIÊN QUAN / CÙNG KHU VỰC */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
              🧭 Hầm tour cùng khu vực
            </h3>
            {relatedTours.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có chương trình tour tương tự.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {relatedTours.map((t: any) => (
                  <Link key={t.id} href={`/tours/${t.slug}`} className="flex gap-3 group items-start">
                    <img 
                      src={t.image} 
                      alt="" 
                      className="w-20 h-14 object-cover rounded-lg border bg-slate-50 shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">📍 Khởi hành: {t.startLocation}</p>
                      <span className="text-xs font-extrabold text-amber-600 block mt-0.5">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(t.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* MỤC 2 BỔ SUNG: KHỐI CẨM NANG & KINH NGHIỆM DU LỊCH NÊN ĐỌC */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
              📰 Cẩm nang kinh nghiệm hay
            </h3>
            {hotPosts.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có bài viết chia sẻ kinh nghiệm.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {hotPosts.map((p: any) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="flex gap-3 group items-start">
                    <img 
                      src={p.image} 
                      alt="" 
                      className="w-20 h-14 object-cover rounded-lg border bg-slate-50 shrink-0" 
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                        {p.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        📅 {new Date(p.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}