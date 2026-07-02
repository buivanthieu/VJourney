// app/(admin)/admin/dashboard/posts/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tourApi } from "@/lib/api";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-xs text-slate-400">Đang nạp trình soạn thảo văn bản...</div>
});

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

export default function AdminPostsDashboard() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    blogCategoryId: "",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", 
    content: "",
  });

  // ĐỒNG BỘ: Sử dụng hoàn toàn qua đối tượng hàm tập trung của lib/api.ts
  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Thay fetch cũ bằng hàm lấy danh mục bài viết ở api.ts thông qua API dùng chung nội bộ
      const API_URL = "http://localhost:5187/api"; 
      const resCats = await fetch(`${API_URL}/blog-categories`);
      if (resCats.ok) {
        const catData = await resCats.json();
        setCategories(catData);
        if (catData.length > 0) {
          setFormData(prev => ({ ...prev, blogCategoryId: catData[0].id }));
        }
      }

      // 2. Sử dụng hàm getAllPosts đã được đóng gói từ lib/api.ts
      const postsData = await tourApi.getAllPosts();
      setPosts(postsData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu phân hệ bài viết:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (contentValue: string) => {
    setFormData((prev) => ({ ...prev, content: contentValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.blogCategoryId) {
      return alert("Vui lòng điền đầy đủ Tên bài viết, Mô tả ngắn và Danh mục!");
    }

    const payload = {
      title: formData.title,
      slug: formData.title.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      image: formData.image,
      summary: formData.summary,
      content: formData.content,
      blogCategoryId: formData.blogCategoryId,
    };

    try {
      const API_URL = "http://localhost:5187/api"; // Đảm bảo đồng bộ ăn theo cổng port chuẩn 5187 giống file api.ts
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("🎉 Đăng bài viết cẩm nang thành công!");
        setIsFormOpen(false);
        setFormData({
          title: "",
          summary: "",
          blogCategoryId: categories[0]?.id || "",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          content: "",
        });
        loadData();
      } else {
        alert("Có lỗi xảy ra khi lưu bài viết.");
      }
    } catch (err) {
      alert("Không thể kết nối đến API Backend C#.");
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [2, 3, 4, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* BANNER ĐIỀU HƯỚNG */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý Cẩm nang / Blog Du lịch</h1>
          <p className="text-xs text-slate-500">Viết bài chia sẻ kinh nghiệm, tối ưu hóa SEO nội dung kéo traffic</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
            isFormOpen ? "bg-slate-600" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isFormOpen ? "✕ Hủy" : "＋ Viết bài mới"}
        </button>
      </div>

      {/* FORM VIẾT BÀI BLOG */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài viết *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Ví dụ: Đi du lịch Hà Giang mùa nào đẹp nhất?" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục bài viết *</label>
            <select name="blogCategoryId" value={formData.blogCategoryId} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ảnh Banner bài viết (URL)</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 text-slate-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả ngắn (Summary - Hiển thị ngoài danh sách) *</label>
            <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={3} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Tóm tắt ngắn gọn nội dung bài viết khoảng 2-3 câu..." />
          </div>

          {/* BỘ GÕ WORD CHO BLOG */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Nội dung chi tiết bài viết (Chuẩn HTML SEO)</label>
            <div className="bg-white rounded-md overflow-hidden border border-slate-300">
              <ReactQuill theme="snow" value={formData.content} onChange={handleEditorChange} modules={quillModules} className="h-80 mb-12" />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm">
              Xuất bản bài viết
            </button>
          </div>
        </form>
      )}

      {/* BẢNG VIEW DANH SÁCH BÀI VIẾT QUẢN TRỊ */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500">Đang tải danh sách bài viết...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl text-sm text-slate-400">Chưa có bài viết nào được xuất bản.</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
                <th className="p-4 w-24">Ảnh</th>
                <th className="p-4">Tên bài viết / Cẩm nang</th>
                <th className="p-4 w-40">Danh mục</th>
                <th className="p-4 w-36">Ngày đăng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4"><img src={post.image} alt="" className="h-12 w-20 object-cover rounded-lg border" /></td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 line-clamp-1">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{post.summary}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
                      {post.blogCategory?.name || "Tin tức"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}