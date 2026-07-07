// app/(client)/blog/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { tourApi } from "@/lib/api";

interface BlogCategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
  createdAt: string;
  blogCategoryId: string;
  blogCategory?: BlogCategoryItem;
}

// COMPONENT CON CHỨA LUỒNG XỬ LÝ CHÍNH ĐỂ BỌC TRONG SUSPENSE
function BlogListContent() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lấy ID danh mục từ URL (ví dụ: /blog?cat=abc-123)
  const catParam = searchParams.get("cat"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, catsData] = await Promise.all([
          tourApi.getAllPosts(),
          tourApi.getBlogCategories()
        ]);
        setPosts(postsData);
        setCategories(catsData);
      } catch (err) {
        console.error("Lỗi đồng bộ danh sách bài viết:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tìm tên danh mục hiện tại nếu đang ở chế độ xem chi tiết danh mục
  const currentCategory = categories.find(c => c.id === catParam);

  // LOGIC LỌC BÀI VIẾT TỔNG HỢP
  const filteredPosts = posts.filter((post) => {
    const matchesKeyword = 
      post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchKeyword.toLowerCase());
    
    // Nếu có catParam trên URL thì ép lọc theo danh mục đó, nếu không thì bỏ qua
    const matchesCategory = !catParam || post.blogCategoryId === catParam;

    return matchesKeyword && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
        Đang tải dữ liệu bài viết...
      </div>
    );
  }

  return (
    <div>
      {/* 1. CHẾ ĐỘ XEM CHI TIẾT MỘT DANH MỤC (?cat=...) HOẶC ĐANG SEARCH KHÁCH HÀNG */}
      {catParam || searchKeyword.trim() !== "" ? (
        <div>
          {/* Thanh tiêu đề chế độ xem lọc sâu */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-8 gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl flex items-center gap-2">
                {catParam ? `📁 Danh mục: ${currentCategory?.name || "Đang tải..."}` : "🔍 Kết quả tìm kiếm toán cục"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Tìm thấy {filteredPosts.length} bài viết phù hợp</p>
            </div>
            
            {/* Nút quay lại Landing Page chính */}
            <button
              onClick={() => {
                setSearchKeyword("");
                router.push("/blog"); // Xóa param trên URL, quay lại trang thảm ban đầu
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2 rounded-full transition-colors w-fit"
            >
              ← Quay về trang chủ Blog
            </button>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed rounded-2xl max-w-sm mx-auto">
              <p className="text-sm text-slate-500 font-medium">Chưa có bài viết nào ở bộ lọc này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      ) : (
        // 2. CHẾ ĐỘ LANDING PAGE TRẢI THẢM (MẶC ĐỊNH) - KÉO SCROLL MỎI TAY
        <div className="space-y-16">
          {categories.map((cat) => {
            const catPosts = posts.filter((p) => p.blogCategoryId === cat.id);
            if (catPosts.length === 0) return null;
            const displayPosts = catPosts.slice(0, 3); // Nhá hàng 3 bài

            return (
              <section key={cat.id} className="border-t border-slate-100 pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl flex items-center gap-2">
                      <span className="h-5 w-1 bg-amber-500 rounded-full block"></span>
                      {cat.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Những bài viết chia sẻ hay nhất về {cat.name.toLowerCase()}</p>
                  </div>
                  
                  {/* FIX THÀNH ĐƯỜNG DẪN ĐỘNG CHUẨN: Đẩy ID danh mục lên URL */}
                  <Link
                    href={`/blog?cat=${cat.id}`}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 whitespace-nowrap bg-amber-50 px-3 py-1 rounded-md transition-colors"
                  >
                    Xem tất cả ({catPosts.length}) →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayPosts.map((post) => <BlogCard key={post.id} post={post} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

// COMPONENT THẺ BÀI VIẾT DÙNG CHUNG
function BlogCard({ post }: { post: PostItem }) {
  return (
    <article className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      <Link href={`/blog/${post.slug}`} className="block aspect-video w-full overflow-hidden bg-slate-100 relative">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-3 left-3 rounded-md bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold text-slate-950 shadow-xs">
          {post.blogCategory?.name || "Cẩm nang"}
        </span>
      </Link>
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-medium">📅 {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.summary}</p>
        </div>
        <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-2">
          Đọc bài viết chi tiết →
        </Link>
      </div>
    </article>
  );
}

// HOÀN THIỆN COMPONENT CHÍNH BỌC TRONG SUSPENSE ĐỂ KHÔNG BỊ LỖI BUILD NEXT.JS
export default function BlogListPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* TIÊU ĐỀ TRANG CẨM NANG */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Cẩm Nang & Kinh Nghiệm Du Lịch
        </h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Bí quyết, lịch trình thực tế và xu hướng du lịch mới nhất được cập nhật liên tục.
        </p>
      </div>

      <Suspense fallback={<div className="text-center text-sm py-10 text-slate-400">Đang khởi tạo danh mục...</div>}>
        <BlogListContent />
      </Suspense>
    </div>
  );
}