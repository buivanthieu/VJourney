// app/(admin)/admin/dashboard/contacts/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { tourApi, ContactResponseDto } from "@/lib/api"; // Gọi trực tiếp từ file api trung tâm của ông

export default function AdminContactsDashboard() {
  const [contacts, setContacts] = useState<ContactResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm tải danh sách liên hệ từ .NET Core Backend qua Service
  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const data = await tourApi.getAllContacts();
      setContacts(data);
    } catch (err) {
      console.error("Lỗi tải danh sách liên hệ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Hàm xử lý XÓA đơn liên hệ tư vấn rác / đã xử lý xong
  const handleDelete = async (id: number) => {
    if (!window.confirm("Ông có chắc chắn muốn xóa form liên hệ này không?")) return;

    try {
      const result = await tourApi.deleteContact(id);
      if (result.success) {
        alert("🗑️ Đã xóa form liên hệ thành công khỏi hệ thống!");
        loadContacts(); // Refresh lại danh sách hiển thị
      } else {
        alert("Xóa thất bại, lỗi xử lý từ server!");
      }
    } catch (err) {
      console.error("Lỗi xóa liên hệ:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      {/* TIÊU ĐỀ TRANG QUẢN TRỊ */}
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h1 className="text-xl font-bold text-slate-900">Quản lý Yêu cầu Tư vấn (Contacts)</h1>
        <p className="text-xs text-slate-500">Tiếp nhận thông tin, số điện thoại của khách hàng đổ về từ Form liên hệ ngoài Client</p>
      </div>

      {/* BẢNG HIỂN THỊ DỮ LIỆU THỰC TẾ */}
      {isLoading ? (
        <div className="text-center py-12 text-sm text-slate-500 flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          Đang đồng bộ dữ liệu liên hệ từ Postgres...
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 border rounded-xl border-dashed border-slate-200 bg-slate-50/50">
          <span className="text-2xl">📭</span>
          <p className="text-sm text-slate-400 mt-2 font-medium">Hộp thư trống! Chưa có khách hàng nào gửi yêu cầu tư vấn.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-xl border-slate-100 shadow-xs">
          <table className="w-full text-left text-sm border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold text-slate-700 uppercase">
                <th className="p-4 w-44">Khách hàng</th>
                <th className="p-4 w-36">Số điện thoại</th>
                <th className="p-4 w-48">Email</th>
                <th className="p-4">Nội dung yêu cầu tư vấn</th>
                <th className="p-4 w-32 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      📅 {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{item.phone}</td>
                  <td className="p-4 text-slate-500 text-xs">{item.email || <span className="text-slate-300 italic">Trống</span>}</td>
                  <td className="p-4 text-slate-600 text-xs leading-relaxed max-w-md">
                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-200/60 text-slate-700">
                      {item.message || <span className="text-slate-300 italic">Khách hàng không để lại tin nhắn kèm theo</span>}
                    </div>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-md font-semibold transition-colors"
                    >
                      🗑️ Xóa Đơn
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