// app/(client)/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import TourCard from "@/components/TourCard";
import { PostResponseDto, tourApi, TourResponseDto } from "@/lib/api";

export default function HomePage() {
  const [tours, setTours] = useState<TourResponseDto[]>([]);
  const [posts, setPosts] = useState<PostResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [tourData, postData] = await Promise.all([
          tourApi.getAllTours(),
          tourApi.getAllPosts()
        ]);
        setTours(tourData.slice(0, 3)); // Lấy 3 tour nổi bật nhất lên trang chủ
        setPosts(postData.slice(0, 3)); // Lấy 3 bài blog mới nhất lên trang chủ
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu trang chủ:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // --- FAKE DATA PHỤC VỤ UY TÍN WEBSITE ---
  const fakeReasons = [
    { title: "Giá niêm yết minh bạch", desc: "Cam kết không phát sinh chi phí ẩn trong suốt hành trình tour.", icon: "" },
    { title: "Đội ngũ điều hành 10 năm", desc: "Hỗ trợ khách hàng 24/7, am hiểu từng cung đường và điểm đến.", icon: "" },
    { title: "Bảo hiểm du lịch cao cấp", desc: "An tâm tuyệt đối với mức bảo hiểm lên tới 100.000.000 VND/vụ.", icon: "" }
  ];

  const fakeTestimonials = [
    { name: "Anh Hoàng Nam", role: "Khách đi tour Sapa", text: "Chuyến đi rất chu đáo! Khách sạn 4 sao sạch sẽ, hướng dẫn viên nhiệt tình, biết nhiều chỗ chụp ảnh đẹp lắm.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { name: "Chị Minh Thư", role: "Khách đi tour Hà Giang", text: "Gia đình mình có cả người già và trẻ nhỏ nhưng điều hành sắp xếp lịch trình rất vừa vặn, không bị mệt. Sẽ ủng hộ tiếp!", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" }
  ];

  const fakeGallery = [
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. SECTION HERO BANNER (HOÀNH TRÁNG) */}
      <div className="relative bg-slate-900 h-[500px] flex items-center justify-center text-center px-4">
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" 
          alt="" 
          className="absolute inset-0 h-full w-full object-cover opacity-40 pointer-events-none" 
        />
        <div className="relative max-w-3xl space-y-6">
          <h1 className="text-3xl font-black text-white sm:text-5xl leading-tight">
            Khám Phá Việt Nam Theo Cách Riêng Của Bạn
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Origin Travel cung cấp các tour du lịch trọn gói chất lượng cao, mang lại trải nghiệm chân thực và an tâm nhất.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/tours" className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md">
              Xem Kho Tour Chuyến Đi
            </Link>
            <Link href="/blog" className="rounded-full bg-slate-800 text-white border border-slate-700 px-6 py-3 text-sm font-bold hover:bg-slate-700 transition-all">
              Đọc Cẩm Nang Du Lịch
            </Link>
          </div>
        </div>
      </div>

      {/* 2. SECTION LÝ DO CHỌN CHÚNG TÔI (CAM KẾT) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Giá Trị Cốt Lõi Của Origin Travel</h2>
          <p className="text-xs text-slate-500 mt-2">Chúng tôi không chỉ bán tour, chúng tôi kiến tạo những kỷ niệm đẹp vô giá.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fakeReasons.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 text-center space-y-3">
              <span className="text-3xl block">{item.icon}</span>
              <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECTION TOUR DU LỊCH BÁN CHẠY (DATA THỰC) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Tour Du Lịch Nổi Bật</h2>
            <p className="text-xs text-slate-500 mt-1">Các chương trình tour đang có lượng khách đăng ký đông đảo nhất tuần này.</p>
          </div>
          <Link href="/tours" className="text-xs font-bold text-emerald-600 hover:underline">Xem tất cả tour →</Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-xs text-slate-400">Đang đồng bộ kho tour...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour: any) => (
              <TourCard key={tour.id} tour={{
                id: tour.id,
                title: tour.title,
                slug: tour.slug,
                image: tour.image,
                duration: tour.duration,
                startLocation: tour.startLocation,
                price: tour.price,
                category: tour.location?.name || "Tour du lịch"
              }} />
            ))}
          </div>
        )}
      </div>

      {/* 4. SECTION THỰC TẾ: KHO ẢNH KHÁCH HÀNG (GALLERY FAKE) */}
      <div className="bg-slate-50 py-12 border-y border-slate-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl"> Khoảnh Khắc Khách Đi Tour</h2>
            <p className="text-xs text-slate-500 mt-2">Hình ảnh chụp thực tế đầy cảm xúc từ những đoàn khách đồng hành cùng Origin Travel.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fakeGallery.map((url, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                <img src={url} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SECTION THỰC TẾ: ĐÁNH GIÁ TỪ KHÁCH HÀNG (TESTIMONIALS FAKE) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl"> Đánh Giá Từ Khách Hàng</h2>
          <p className="text-xs text-slate-500 mt-2">98% khách hàng phản hồi hài lòng và sẵn sàng giới thiệu cho bạn bè.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {fakeTestimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 items-start">
              <img src={t.avatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 border" />
              <div className="space-y-2">
                <div className="flex text-amber-400 text-xs">⭐⭐⭐⭐⭐</div>
                <p className="text-xs text-slate-600 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{t.name}</h4>
                  <span className="text-[10px] text-slate-400">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. SECTION CẨM NANG MỚI NHẤT (DATA THỰC) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Bài Viết & Cẩm Nang Du Lịch Mới</h2>
            <p className="text-xs text-slate-500 mt-1">Cập nhật xu hướng, thông tin vé cáp treo, kinh nghiệm ăn chơi cực bổ ích.</p>
          </div>
          <Link href="/blog" className="text-xs font-bold text-amber-600 hover:underline">Xem tất cả bài viết →</Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-xs text-slate-400">Đang tải bài viết...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
                <Link href={`/blog/${post.slug}`} className="block aspect-video w-full overflow-hidden bg-slate-100 relative">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{post.summary}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}