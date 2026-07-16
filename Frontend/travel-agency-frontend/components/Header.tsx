// components/Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tourApi } from "@/lib/api";

interface LocationItem {
  id: number;
  name: string;
  slug: string;
}

export default function Header() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false); // Dropdown mới cho Về chúng tôi
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await tourApi.getLocations();
        setLocations(data);
      } catch (err) {
        console.error("Lỗi tải danh mục lên navbar:", err);
      }
    };
    fetchLocations();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo công ty */}
        <Link href="/" className="text-xl font-bold text-emerald-600 tracking-tight">
          VJOURNEY <span className="text-amber-500">TRAVEL</span>
        </Link>

        {/* Menu chính */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-slate-700 h-full items-center">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
          
          {/* 1. DROPDOWN DANH SÁCH TOUR */}
          <div 
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setIsTourDropdownOpen(true)}
            onMouseLeave={() => setIsTourDropdownOpen(false)}
          >
            <Link href="/tours" className="hover:text-emerald-600 transition-colors flex items-center gap-1 py-4">
              Danh sách Tour <span className="text-[10px] text-slate-400">▼</span>
            </Link>

            {isTourDropdownOpen && locations.length > 0 && (
              <div className="absolute top-[60px] left-0 w-52 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 animate-fadeIn">
                <Link href="/tours" onClick={() => setIsTourDropdownOpen(false)} className="block px-4 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-50 uppercase tracking-wider">
                  Tất cả điểm đến
                </Link>
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setIsTourDropdownOpen(false);
                      router.push(`/tours?location=${loc.id}`);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"
                  >
                    📍 Tour {loc.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. DROPDOWN VỀ CHÚNG TÔI (CẬP NHẬT MỚI) */}
          <div 
            className="relative h-full flex items-center group cursor-pointer"
            onMouseEnter={() => setIsAboutDropdownOpen(true)}
            onMouseLeave={() => setIsAboutDropdownOpen(false)}
          >
            <span className="hover:text-emerald-600 transition-colors flex items-center gap-1 py-4">
              Về chúng tôi <span className="text-[10px] text-slate-400">▼</span>
            </span>

            {isAboutDropdownOpen && (
              <div className="absolute top-[60px] left-0 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-100 py-2 animate-fadeIn text-xs font-semibold">
                <Link href="/about/introduction" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block">🏢 Giới thiệu công ty</Link>
                <Link href="/about/privacy-policy" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block">🔒 Chính sách riêng tư</Link>
                <Link href="/about/refund-policy" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block">🔄 Chính sách hoàn hủy</Link>
                <Link href="/about/payment-methods" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block">💳 Phương thức thanh toán</Link>
                <Link href="/about/terms-of-use" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block">📋 Điều khoản sử dụng</Link>
              </div>
            )}
          </div>

          <Link href="/blog" className="hover:text-emerald-600 transition-colors">Cẩm nang du lịch</Link>
          <Link href="/contact" className="hover:text-emerald-600 transition-colors">Liên hệ</Link>
        </nav>

        {/* Hotline */}
        <div className="flex items-center gap-4">
          <a href="tel:0900123456" className="hidden sm:block text-sm font-semibold text-slate-950 bg-amber-400 px-4 py-2 rounded-full hover:bg-amber-500 transition-colors">
            Hotline: 090 123 456
          </a>
        </div>
      </div>
    </header>
  );
}