// app/(client)/contact/page.tsx
"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      return alert("Vui lòng nhập Tên và Số điện thoại liên hệ!");
    }

    // Tạm thời log dữ liệu Front-End trước, xử lý Back-End sau
    console.log("Dữ liệu form khách hàng gửi liên hệ (FE):", formData);
    
    setIsSubmitted(true);
    alert("🎉 Cảm ơn ông! Hệ thống Front-End đã ghi nhận thông tin tư vấn.");
    
    // Reset Form
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Liên Hệ Với Vjourney Travel</h1>
        <p className="mt-2 text-sm text-slate-500">Đội ngũ điều hành tour luôn sẵn sàng lắng nghe và thiết kế lịch trình theo đúng yêu cầu của ông.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CỘT TRÁI (1/3): THÔNG TIN VĂN PHÒNG */}
        <div className="lg:col-span-1 bg-slate-900 text-slate-300 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-white font-bold text-base border-b border-slate-800 pb-2 uppercase tracking-wider">Thông tin trụ sở</h3>
          
          <div className="space-y-4 text-xs leading-relaxed">
            <p className="flex items-start gap-2">
              <span className="text-sm">📍</span>
              <span><strong>Địa chỉ văn phòng:</strong> 123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sm">📞</span>
              <span><strong>Tổng đài hỗ trợ:</strong> 090 123 456 (24/7)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sm">✉️</span>
              <span><strong>Email tiếp nhận:</strong> contact@vjourney-travel.com</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-sm">⏰</span>
              <span><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 7 (08:00 - 17:30)</span>
            </p>
          </div>

          {/* Khối giả lập bản đồ Google Map bằng hình ảnh cho đẹp website */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-800 aspect-video relative flex items-center justify-center text-[10px] text-slate-500">
            [Bản đồ Google Maps vệ tinh vị trí văn phòng Quận 1]
          </div>
        </div>

        {/* CỘT PHẢI (2/3): FORM ĐĂNG KÝ TƯ VẤN TOUR / LIÊN HỆ */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-slate-900 font-bold text-base mb-4 border-b pb-2">Để lại lời nhắn tư vấn miễn phí</h3>
          
          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên của ông *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500" placeholder="Nguyễn Văn A" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại liên lạc *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500" placeholder="0901234567" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ Email (Nếu có)</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500" placeholder="example@gmail.com" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung yêu cầu / Tour ông quan tâm</label>
              <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 leading-relaxed" placeholder="Tôi muốn nhận báo giá tour du lịch Đà Nẵng 3 ngày cho đoàn 10 người lớn..." />
            </div>

            <div className="sm:col-span-2 mt-2">
              <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs">
                Gửi Thông Tin Liên Hệ
              </button>
            </div>
          </form>

          {isSubmitted && (
            <p className="mt-4 text-xs font-medium text-emerald-600 text-center bg-emerald-50 p-2 rounded-lg border border-emerald-100">
              ✓ Yêu cầu liên hệ của ông đã được chuyển sang tab Console log của trình duyệt. Sẵn sàng tích hợp API .NET bất cứ lúc nào!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}