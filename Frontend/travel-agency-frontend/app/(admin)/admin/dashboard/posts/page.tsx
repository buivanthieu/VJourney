// app/(admin)/admin/dashboard/posts/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tourApi } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient"; // Kết nối Supabase Cloud của ông

// Import CSS giao diện của bộ gõ Quill
import "react-quill-new/dist/quill.snow.css";
import RichTextEditor from "@/components/RichTextEditor";

// Tải động bộ gõ Quill Editor và tắt SSR để tránh lỗi render phía máy chủ
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-xs text-slate-400">Đang nạp trình soạn thảo văn bản...</div>
});

interface BlogCategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface PostItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
  createdAt: string;
  blogCategoryId: number;
  blogCategory?: BlogCategoryItem;
}

export default function AdminPostsDashboard() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [categories, setCategories] = useState<BlogCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Trạng thái tiến trình tải ảnh lên Cloud Storage
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    blogCategoryId: 0,
    image: "", // Lưu link ảnh CDN công khai
    content: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const catData = await tourApi.getBlogCategories();
      setCategories(catData);
      
      if (catData.length > 0 && !editingId) {
        setFormData(prev => ({ ...prev, blogCategoryId: catData[0].id }));
      }

      const postsData = await tourApi.getAllPosts();
      setPosts(postsData);
    } catch (err) {
      console.error("Lỗi đồng bộ hệ thống quản trị bài viết:", err);
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

  // ─── XỬ LÝ UPLOAD ẢNH BANNER BLOG LÊN SUPABASE STORAGE ───
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Tạo tên file ngẫu nhiên tránh trùng trên Cloud
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`; // Ảnh gom vào folder 'posts' trong Bucket

      // Tiến hành upload file
      const { error: uploadError } = await supabase.storage
        .from('vjourney-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Lấy link CDN công khai
      const { data } = supabase.storage
        .from('vjourney-images')
        .getPublicUrl(filePath);

      // Đút link ảnh vào State để submit sang .NET
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      console.log('Link ảnh Supabase CDN của Post:', data.publicUrl);

    } catch (error) {
      console.error('Lỗi upload ảnh bài viết:', error);
      alert('Tải ảnh bài viết thất bại, vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  // Kích hoạt chế độ SỬA bài viết
  const handleEditClick = (post: PostItem) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      summary: post.summary,
      blogCategoryId: post.blogCategoryId,
      image: post.image,
      content: post.content,
    });
    setIsFormOpen(true);
  };

  // Xử lý XÓA bài viết
  const handleDeleteClick = async (id: number) => {
    if (!window.confirm("Ông có chắc chắn muốn xóa bài viết cẩm nang này không?")) return;
    
    const res = await tourApi.deletePost(id);
    if (res.success) {
      alert("🗑️ Đã xóa bài viết thành công!");
      loadData();
    } else {
      alert("Xóa bài viết thất bại.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.blogCategoryId) {
      return alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }

    if (!formData.image) {
      return alert("Vui lòng chọn ảnh đại diện/banner cho bài viết cẩm nang!");
    }

    // Biện pháp chống tràn chữ: Quét sạch mã khoảng cách dính liền &nbsp; và \u00a0
    const cleanContent = formData.content
      .replace(/&nbsp;/g, " ")
      .replace(/\u00a0/g, " ");

    const payload = {
      title: formData.title,
      slug: formData.title.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      image: formData.image,
      summary: formData.summary,
      content: cleanContent,
      blogCategoryId: formData.blogCategoryId,
    };

    let result;
    if (editingId) {
      result = await tourApi.updatePost(editingId, payload);
    } else {
      result = await tourApi.createPost(payload);
    }

    if (result.success) {
      alert(editingId ? "🎉 Đã cập nhật bài viết thành công!" : "🎉 Đã xuất bản bài viết mới thành công!");
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        summary: "",
        blogCategoryId: categories[0]?.id || 0,
        image: "",
        content: "",
      });
      loadData();
    } else {
      alert("Thao tác thất bại.");
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
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Quản lý Cẩm nang / Blog Du lịch</h1>
          <p className="text-xs text-slate-500">Viết bài, chỉnh sửa nội dung chia sẻ kinh nghiệm chuẩn SEO</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (isFormOpen) setEditingId(null);
          }}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors ${
            isFormOpen ? "bg-slate-600" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isFormOpen ? "✕ Hủy" : "＋ Viết bài mới"}
        </button>
      </div>

      {/* FORM THÊM / SỬA BÀI VIẾT TÍCH HỢP SUPABASE */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="font-bold text-slate-900 md:col-span-2 text-xs uppercase text-emerald-600 tracking-wider">
            {editingId ? "Biểu mẫu Chỉnh sửa bài viết" : "Biểu mẫu Viết bài mới"}
          </h3>

          {/* UPLOAD FILE ẢNH BANNER BÀI VIẾT */}
          <div className="md:col-span-2 bg-white p-4 rounded-xl border border-dashed border-slate-300">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Ảnh bìa bài viết *</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={isUploading}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer disabled:opacity-50"
            />
            {isUploading && (
              <p className="text-emerald-600 text-[10px] mt-2 animate-pulse font-medium">
                🚀 Đang tải tệp ảnh bài viết lên Supabase Bucket storage...
              </p>
            )}
            
            {formData.image && (
              <div className="mt-3">
                <p className="text-emerald-600 text-[10px] mb-1 font-semibold">✓ Ảnh CDN bài viết đã sẵn sàng:</p>
                <img src={formData.image} alt="Preview" className="h-40 w-full object-cover rounded-lg border shadow-xs" />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài viết *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục bài viết *</label>
            <select name="blogCategoryId" value={formData.blogCategoryId} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả ngắn (Summary) *</label>
            <textarea name="summary" value={formData.summary} onChange={handleInputChange} rows={3} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Tóm tắt nội dung bài viết..." />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Bài viết chi tiết
            </label>
            <div className="bg-white rounded-md overflow-hidden border border-slate-300">
              <RichTextEditor
                value={formData.content}
                onChange={(contentValue) => setFormData(prev => ({ ...prev, content: contentValue }))}
                bucketFolder="posts" 
                placeholder="Nhập bài viết chi tiết ..."
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={isUploading}
              className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-colors shadow-sm ${
                isUploading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isUploading ? "Vui lòng đợi ảnh tải xong..." : editingId ? "Cập Nhật Bài Viết" : "Xuất Bản Bài Viết"}
            </button>
          </div>
        </form>
      )}

      {/* BẢNG VIEW DANH SÁCH BÀI VIẾT QUẢN TRỊ KÈM HÀNH ĐỘNG ACTION */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500">Đang nạp dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
                <th className="p-4 w-24">Ảnh</th>
                <th className="p-4">Tên bài viết / Cẩm nang</th>
                <th className="p-4 w-36">Danh mục</th>
                <th className="p-4 w-44 text-right">Hành động</th>
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
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button onClick={() => handleEditClick(post)} className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-md font-semibold transition-colors">✏️ Sửa</button>
                    <button onClick={() => handleDeleteClick(post.id)} className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 rounded-md font-semibold transition-colors">🗑️ Xóa</button>
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