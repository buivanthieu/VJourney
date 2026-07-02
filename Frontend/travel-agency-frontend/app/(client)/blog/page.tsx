// app/(client)/blog/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  blogCategory?: BlogCategoryItem;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await tourApi.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Lỗi đồng bộ danh sách bài viết:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Lọc bài viết theo từ khóa tiêu đề hoặc tóm tắt bài viết
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* TIÊU ĐỀ TRANG CẨM NANG */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Cẩm Nang & Kinh Nghiệm Du Lịch
        </h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Chia sẻ những bí quyết, lịch trình thực tế và xu hướng du lịch mới nhất giúp bạn có một chuyến đi trọn vẹn.
        </p>

        {/* THANH TÌM KIẾM BÀI VIẾT BÊN TRÊN */}
        <div className="mt-6 max-w-md mx-auto">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm kiếm cẩm nang, kinh nghiệm du lịch..."
            className="w-full rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs outline-none focus:border-amber-500 shadow-xs transition-all"
          />
        </div>
      </div>

      {/* HIỂN THỊ DANH SÁCH GRID */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
          Đang tải bài viết từ hệ thống...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white border rounded-xl">
          <p className="text-sm text-slate-500">Chưa tìm thấy bài viết nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
              {/* Ảnh bìa */}
              <Link href={`/blog/${post.slug}`} className="block aspect-video w-full overflow-hidden bg-slate-100 relative group">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 rounded-md bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold text-slate-950">
                  {post.blogCategory?.name || "Kinh nghiệm"}
                </span>
              </Link>

              {/* Nội dung text bài viết */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    📅 {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-2"
                >
                  Đọc bài viết chi tiết →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}