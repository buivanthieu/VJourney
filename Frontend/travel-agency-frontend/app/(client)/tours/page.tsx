// app/(client)/tours/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TourCard from "@/components/TourCard";
import { tourApi } from "@/lib/api";

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

// KHỐI GIAO DIỆN VÀ LOGIC CHÍNH ĐƯỢC TÁCH RA ĐỂ ĐỒNG BỘ URL PARAM
function ToursListContent() {
  const [tours, setTours] = useState<TourItemNew[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(10000000);

  const searchParams = useSearchParams();
  const locParam = searchParams.get("location"); // Đọc tham số ?location=... từ Header gửi sang

  // 1. Tải dữ liệu ban đầu từ API Backend 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourData, locData] = await Promise.all([
          tourApi.getAllTours(),
          tourApi.getLocations()
        ]);
        
        setTours(tourData as unknown as TourItemNew[]);
        setLocations(locData); 
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu trang danh sách:", err); 
      } finally {
        setIsLoading(false);  
      }
    };
    fetchData();
  }, []);

  // 2. NÂNG CẤP QUAN TRỌNG: Lắng nghe URL change. Nếu có param từ Header thì ép giá trị vào ô Select ngay
  useEffect(() => {
    if (locParam) {
      setSelectedLocation(locParam);
    } else {
      setSelectedLocation("all");
    }
  }, [locParam]);

  // LOGIC LỌC (Giữ nguyên cơ chế lọc mượt mà của ông) 
  const filteredTours = tours.filter((tour) => {
    const matchesKeyword = 
      tour.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      tour.startLocation.toLowerCase().includes(searchKeyword.toLowerCase()); 
    const matchesLocation = selectedLocation === "all" || tour.locationId === selectedLocation; 
    const matchesPrice = tour.price <= maxPrice; 

    return matchesKeyword && matchesLocation && matchesPrice; 
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* THANH BỘ LỌC BÊN TRÁI  */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6"> 
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b pb-2">Bộ lọc tìm kiếm</h3> 
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Từ khóa cần tìm</label>
          <input type="text" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Nhập tên tour, địa danh..." className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all" /> 
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm đến du lịch</label>
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)} 
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500 focus:bg-white transition-all"
          >
            <option value="all">-- Tất cả điểm đến --</option> 
            {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.name}</option>)} 
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">Ngân sách tối đa</label>
            <span className="text-xs font-bold text-amber-600">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(maxPrice)}</span> 
          </div>
          <input type="range" min="1000000" max="15000000" step="500000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" /> 
        </div>

        <button onClick={() => { setSearchKeyword(""); setSelectedLocation("all"); setMaxPrice(10000000); }} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors">Clear bộ lọc</button> 
      </div>

      {/* LƯỚI HIỂN THỊ TOURS BÊN PHẢI  */}
      <div className="lg:col-span-3">
        {isLoading ? (
          <div className="text-center py-20 text-slate-400 text-sm flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
            Đang đồng bộ dữ liệu tour...
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 bg-white border rounded-xl shadow-xs">
            <span className="text-3xl">🔍</span> 
            <p className="text-sm text-slate-500 mt-2 font-medium">Không tìm thấy tour nào khớp với bộ lọc.</p> 
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={{
                id: tour.id,
                title: tour.title,
                slug: tour.slug,
                image: tour.image,
                duration: tour.duration,
                startLocation: tour.startLocation,
                price: tour.price,
                category: tour.location?.name || "Tour du lịch"
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// FILE CHÍNH BỌC TRONG SUSPENSE ĐỂ TRÁNH LỖI KHI ĐỌC QUERY PARAM ĐỘNG TRONG NEXT.JS
export default function ToursPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Tiêu đề  */}
      <div className="border-b border-slate-200 pb-5 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hành Trình Du Lịch Việt Nam</h1> 
        <p className="mt-2 text-sm text-slate-500">Tìm kiếm nhanh các chương trình tour chất lượng cao, giá niêm yết minh bạch.</p> 
      </div>

      <Suspense fallback={<div className="text-center py-10 text-xs text-slate-400">Đang đồng bộ bộ lọc URL...</div>}>
        <ToursListContent />
      </Suspense>
    </div>
  );
}