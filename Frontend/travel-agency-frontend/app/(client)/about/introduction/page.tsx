// Ví dụ mẫu cho file app/(client)/about/introduction/page.tsx
import React from "react";

export default function IntroductionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose text-sm text-slate-600 leading-relaxed">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Về Công Ty Vjourney Travel</h1>
      <p>Chào mừng đến với Vjourney Travel - Đơn vị lữ hành uy tín hàng đầu chuyên tổ chức tour du lịch khám phá và nghỉ dưỡng trọn gói tại Việt Nam.</p>
      <p>Với triết lý lấy trải nghiệm khách hàng làm kim chỉ nam, chúng tôi cam kết thiết kế các lịch trình độc đáo, điểm đến an toàn và chi phí hợp lý nhất.</p>
    </div>
  );
}