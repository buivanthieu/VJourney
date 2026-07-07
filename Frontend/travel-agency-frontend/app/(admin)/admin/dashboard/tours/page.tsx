// app/(admin)/admin/dashboard/tours/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { tourApi } from "@/lib/api";

// Import CSS giao diện của bộ gõ Quill
import "react-quill-new/dist/quill.snow.css";

// Tải động bộ gõ Quill Editor và tắt SSR để tránh lỗi render phía máy chủ
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 w-full bg-slate-100 animate-pulse rounded-md flex items-center justify-center text-xs text-slate-400">Đang nạp trình soạn thảo văn bản...</div>
});

interface LocationItem {
  id: string;
  name: string;
  slug: string;
}

interface TourItemNew {
  id: string;
  title: string;
  slug: string;
  image: string;
  duration: string;
  price: number;
  startLocation: string;
  locationId: string;
  location?: LocationItem;
  content: string;
}

export default function AdminDashboard() {
  const [tours, setTours] = useState<TourItemNew[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // State kiểm tra chế độ Sửa

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    startLocation: "Hà Nội",
    price: "",
    locationId: "",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
    content: "", 
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const locData = await tourApi.getLocations();
      setLocations(locData);
      
      if (locData.length > 0 && !editingId) {
        setFormData(prev => ({ ...prev, locationId: locData[0].id }));
      }

      const tourData = await tourApi.getAllTours();
      setTours(tourData as unknown as TourItemNew[]);
    } catch (err) {
      console.error("Lỗi đồng bộ hệ thống quản trị Tour:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (contentValue: string) => {
    setFormData((prev) => ({ ...prev, content: contentValue }));
  };

  // Kích hoạt chế độ SỬA TOUR
  const handleEditClick = (tour: TourItemNew) => {
    setEditingId(tour.id);
    setFormData({
      title: tour.title,
      duration: tour.duration,
      startLocation: tour.startLocation,
      price: String(tour.price),
      locationId: tour.locationId,
      image: tour.image,
      content: tour.content,
    });
    setIsFormOpen(true);
  };

  // Xử lý XÓA TOUR
  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Ông có chắc chắn muốn xóa chương trình tour này không?")) return;
    
    const res = await tourApi.deleteTour(id);
    if (res.success) {
      alert("🗑️ Đã xóa chương trình tour thành công!");
      loadData();
    } else {
      alert("Xóa tour thất bại.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.price || !formData.locationId) {
      return alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    }

    // BIỆN PHÁP CHỐNG TRÀN CHỮ: Thay thế triệt để dấu cách dính liền &nbsp; thành dấu cách trống chuẩn
    const cleanContent = formData.content
      .replace(/&nbsp;/g, " ")
      .replace(/\u00a0/g, " ");

    const payload = {
      title: formData.title,
      slug: formData.title.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      image: formData.image,
      duration: formData.duration || "Chưa xác định",
      startLocation: formData.startLocation,
      price: Number(formData.price),
      locationId: formData.locationId,
      content: cleanContent, 
    };

    let result;
    if (editingId) {
      result = await tourApi.updateTour(editingId, payload);
    } else {
      result = await tourApi.createTour(payload);
    }

    if (result.success) {
      alert(editingId ? "🎉 Đã cập nhật thông tin Tour thành công!" : "🎉 Đã tạo chương trình Tour mới thành công!");
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        title: "",
        duration: "",
        startLocation: "Hà Nội",
        price: "",
        locationId: locations[0]?.id || "",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80",
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
          <h1 className="text-xl font-bold text-slate-900">Quản lý Chương trình Tour</h1>
          <p className="text-xs text-slate-500">Trải nghiệm soạn thảo lịch trình trực quan như Microsoft Word</p>
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
          {isFormOpen ? "✕ Hủy" : "＋ Thêm Tour mới"}
        </button>
      </div>

      {/* FORM THÊM / SỬA TOUR CHỨA BỘ GÕ QUILL */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 className="font-bold text-slate-900 md:col-span-2 text-xs uppercase text-emerald-600 tracking-wider">
            {editingId ? "Biểu mẫu chỉnh sửa Tour" : "Biểu mẫu thiết lập Tour mới"}
          </h3>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Tour du lịch *</label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Tiền (VND) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Thời Lượng Chuyến Đi</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" placeholder="Ví dụ: 3 Ngày 2 Đêm" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm Khởi Hành</label>
            <input type="text" name="startLocation" value={formData.startLocation} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Địa điểm du lịch (Category)*</label>
            <select name="locationId" value={formData.locationId} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500">
              {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn ảnh đại diện (URL)</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500 text-slate-500" />
          </div>

          {/* NHÚNG BỘ SOẠN THẢO WORD */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Lịch trình chi tiết & Điều khoản dịch vụ (Chuẩn SEO)
            </label>
            <div className="bg-white rounded-md overflow-hidden border border-slate-300">
              <ReactQuill 
                theme="snow"
                value={formData.content}
                onChange={handleEditorChange}
                modules={quillModules}
                className="h-72 mb-12"
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm">
              {editingId ? "Cập Nhật Chương Trình Tour" : "Lưu Chương Trình Tour"}
            </button>
          </div>
        </form>
      )}

      {/* BẢNG VIEW DANH SÁCH TOURS KÈM NÚT SỬA/XÓA */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500">Đang nạp dữ liệu...</div>
      ) : (
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-left text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
                <th className="p-4 w-24">Ảnh</th>
                <th className="p-4">Chương trình Tour</th>
                <th className="p-4 w-36">Địa điểm</th>
                <th className="p-4 w-40 text-right">Giá niêm yết</th>
                <th className="p-4 w-44 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4"><img src={tour.image} alt="" className="h-12 w-20 object-cover rounded-lg border" /></td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{tour.title}</div>
                    <div className="text-xs text-slate-400 mt-1">🕒 {tour.duration} | 📍 Khởi hành: {tour.startLocation}</div>
                  </td>
                  <td className="p-4"><span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">{tour.location?.name || "Chưa gán"}</span></td>
                  <td className="p-4 text-right font-extrabold text-slate-900">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(tour.price)}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleEditClick(tour)}
                      className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-md font-semibold transition-colors"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tour.id)}
                      className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 rounded-md font-semibold transition-colors"
                    >
                      🗑️ Xóa
                    </button>
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