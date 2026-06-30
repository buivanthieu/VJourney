// app/(client)/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* HERO SECTION - Banner lớn đầu trang */}
      <section className="relative bg-slate-900 py-32 text-center text-white bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80')" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Khám Phá Việt Nam Theo Cách Riêng Của Bạn
          </h1>
          <p className="mt-4 text-xl text-slate-200 max-w-2xl mx-auto">
            Trải nghiệm các tour du lịch được thiết kế may đo riêng biệt, phù hợp với mọi nhu cầu của gia đình và tổ chức.
          </p>

          {/* Nút kêu gọi hành động (CTA) hướng tới danh sách tour */}
          <div className="mt-8">
            <Link
              href="/tours"
              className="inline-block rounded-md bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Xem ngay các Tour nổi bật
            </Link>
          </div>
        </div>
      </section>

      {/* KHU VỰC THÔNG TIN NGẮN GIỚI THIỆU ƯU ĐIỂM */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Tại sao nên chọn chúng tôi?</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-3xl mb-2">🗺️</div>
            <h3 className="font-semibold text-slate-900 mb-2">Lịch trình linh hoạt</h3>
            <p className="text-sm text-slate-600">Thiết kế tùy chỉnh theo thời gian và ngân sách riêng của bạn.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-slate-900 mb-2">Giá cả minh bạch</h3>
            <p className="text-sm text-slate-600">Đảm bảo dịch vụ xứng đáng với từng chi phí bạn bỏ ra.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold text-slate-900 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-sm text-slate-600">Đội ngũ điều hành tour luôn theo sát bạn suốt hành trình.</p>
          </div>
        </div>
      </section>
    </div>
  );
}