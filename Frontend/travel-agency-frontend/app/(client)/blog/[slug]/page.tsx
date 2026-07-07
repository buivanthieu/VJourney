// app/(client)/blog/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { tourApi } from "@/lib/api";

interface Props {
  params: Promise<{ slug: string }>;
}

// Hàm tự động tối ưu SEO Meta tags lên Google
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await tourApi.getPostBySlug(slug);

  if (!post) return { title: "Không tìm thấy bài viết - Origin Travel" };

  return {
    title: `${post.title} | Cẩm Nang Origin Travel`,
    description: post.summary.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.summary.substring(0, 160),
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await tourApi.getPostBySlug(slug);

  // Bốc thêm danh sách tất cả bài viết và tour để làm phần Đề xuất ở cột phải
  const [allPosts, allTours] = await Promise.all([
    tourApi.getAllPosts(),
    tourApi.getAllTours()
  ]);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Bài viết không tồn tại hoặc đã bị gỡ bỏ.</h2>
      </div>
    );
  }

  // Lọc lấy 4 bài viết khác (bỏ bài đang xem) để đưa vào mục "Có thể bạn sẽ thích"
  const recommendedPosts = allPosts
    .filter((p: any) => p.id !== post.id)
    .slice(0, 4);

  // Lấy 3 tour mới nhất để quảng cáo ngay trong bài viết kinh nghiệm
  const hotTours = allTours.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ĐƯỜNG DẪN BREADCRUMB */}
      <div className="text-xs text-slate-400 flex items-center gap-2 mb-6">
        <Link href="/" className="hover:text-slate-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-slate-600">Cẩm nang</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium truncate max-w-md">{post.title}</span>
      </div>

      {/* BỐ CỤC 2 CỘT THỰC CHIẾN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (CHIẾM 2/3): NỘI DUNG CHI TIẾT BÀI BLOG */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full min-w-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
            
            {/* Tiêu đề lớn */}
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3.5xl leading-tight mb-4">
              {post.title}
            </h1>

            {/* Meta ngày đăng */}
            <div className="flex items-center gap-4 text-xs text-slate-400 border-b pb-4 border-slate-100 mb-6">
              <span>📅 Ngày đăng: {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
              <span>•</span>
              <span className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-md font-semibold">
                {post.blogCategory?.name || "Kinh nghiệm du lịch"}
              </span>
            </div>

            {/* Khối tóm tắt bài viết */}
            <p className="p-4 bg-slate-50 border-l-4 border-amber-500 text-sm text-slate-600 italic rounded-r-xl leading-relaxed mb-6">
              {post.summary}
            </p>

            {/* BUNG NỘI DUNG HTML CHỐNG RÁCH CHỮ VÀ VỠ LAYOUT */}
            <div 
              className="prose prose-amber max-w-none text-slate-700 text-sm leading-relaxed space-y-4 break-words whitespace-normal
                prose-headings:font-bold prose-headings:text-slate-900
                prose-h2:text-xl prose-h2:border-b prose-h2:pb-1 prose-h2:mt-8
                prose-h3:text-base prose-h3:mt-5
                prose-img:rounded-xl prose-img:shadow-sm prose-img:my-4 prose-img:max-w-full prose-img:h-auto"
              style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>

        {/* CỘT PHẢI (CHIẾM 1/3): CỘT SIDEBAR ĐỀ XUẤT THÔNG MINH */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* MỤC 1: BÀI VIẾT BẠN CÓ THỂ THÍCH */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
              📝 Có thể bạn sẽ thích
            </h3>
            {recommendedPosts.length === 0 ? (
              <p className="text-xs text-slate-400">Chưa có bài viết đề xuất khác.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recommendedPosts.map((p: any) => (
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

          {/* MỤC 2: TOUR DU LỊCH HOT GỢI Ý (TĂNG DOANH THU) */}
          <div className="sticky top-24 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2 mb-4 flex items-center gap-2">
              🔥 Tour du lịch nổi bật
            </h3>
            {hotTours.length === 0 ? (
              <p className="text-xs text-slate-400">Hệ thống chưa ghi nhận Tour mới.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {hotTours.map((t: any) => (
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
                      <p className="text-[10px] text-slate-400 mt-0.5">🕒 Thời gian: {t.duration}</p>
                      <span className="text-xs font-extrabold text-amber-600 block mt-0.5">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(t.price)}
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