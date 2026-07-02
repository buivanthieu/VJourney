// app/(client)/blog/[slug]/page.tsx
import React from "react";
import { Metadata } from "next";
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

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Bài viết không tồn tại hoặc đã bị gỡ bỏ.</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <article className="space-y-6">
        {/* Đường dẫn nhỏ (Breadcrumb) */}
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <a href="/" className="hover:text-slate-600">Trang chủ</a>
          <span>/</span>
          <a href="/blog" className="hover:text-slate-600">Cẩm nang</a>
          <span>/</span>
          <span className="text-slate-600 font-medium truncate">{post.title}</span>
        </div>

        {/* Tiêu đề lớn của bài viết */}
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-4xl leading-tight">
          {post.title}
        </h1>

        {/* Thông tin tác giả / ngày tháng */}
        <div className="flex items-center gap-4 text-xs text-slate-400 border-b pb-4 border-slate-100">
          <span>📅 Ngày đăng: {new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
          <span>•</span>
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-sm font-semibold">
            {post.blogCategory?.name || "Kinh nghiệm du lịch"}
          </span>
        </div>

        {/* Khối mô tả tóm tắt bôi xám */}
        <p className="p-4 bg-slate-50 border-l-4 border-amber-500 text-sm text-slate-600 italic rounded-r-xl leading-relaxed">
          {post.summary}
        </p>

        {/* KHU VỰC CHÍNH: BUNG TOÀN BỘ MÃ HTML WORD RA GIAO DIỆN CHUẨN SEO */}
        <div 
          className="prose prose-amber max-w-none text-slate-700 text-sm leading-relaxed space-y-4 pt-4
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-xl prose-h2:border-b prose-h2:pb-1 prose-h2:mt-6
            prose-h3:text-base prose-h3:mt-4
            prose-img:rounded-xl prose-img:shadow-xs prose-img:my-4"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>
    </div>
  );
}