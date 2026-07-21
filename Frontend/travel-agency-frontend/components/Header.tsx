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
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false); 
  
  // Trạng thái đóng/mở menu 3 gạch trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Trạng thái đóng/mở dropdown con riêng trên giao diện Mobile
  const [isMobileTourOpen, setIsMobileTourOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

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

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsMobileTourOpen(false);
    setIsMobileAboutOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs"> 
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"> 
        
        {/* Logo công ty */}
        <Link href="/" onClick={closeAllMenus} className="text-xl font-bold text-emerald-600 tracking-tight"> 
          VJOURNEY <span className="text-amber-500">TRAVEL</span> 
        </Link> 

        {/* ================= PC MENU (Giữ nguyên gốc của ông) ================= */}
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
                    Tour {loc.name} 
                  </button> 
                ))} 
              </div> 
            )} 
          </div> 

          {/* 2. DROPDOWN VỀ CHÚNG TÔI */}
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
                <Link href="/about/introduction" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"> Giới thiệu công ty</Link> 
                <Link href="/about/privacy-policy" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"> Chính sách riêng tư</Link> 
                <Link href="/about/refund-policy" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"> Chính sách hoàn hủy</Link> 
                <Link href="/about/payment-methods" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"> Phương thức thanh toán</Link> 
                <Link href="/about/terms-of-use" onClick={() => setIsAboutDropdownOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 hover:text-emerald-600 transition-colors block"> Điều khoản sử dụng</Link> 
              </div> 
            )} 
          </div> 

          <Link href="/blog" className="hover:text-emerald-600 transition-colors">Cẩm nang du lịch</Link> 
          <Link href="/contact" className="hover:text-emerald-600 transition-colors">Liên hệ</Link> 
        </nav> 

        {/* Góc phải: Đăng nhập & Hotline */}
        <div className="hidden md:flex items-center gap-4"> 
          <Link 
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-1.5 rounded-full bg-slate-50 transition-all"
          >
            Đăng nhập
          </Link>
          <a href="tel:0900123456" className="text-sm font-semibold text-slate-950 bg-amber-400 px-4 py-2 rounded-full hover:bg-amber-500 transition-colors"> 
            Hotline: 090 123 456 
          </a> 
        </div>

        {/* ================= NÚT 3 GẠCH TRÊN MOBILE ================= */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/login" className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
            Đăng nhập
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-700 p-2 outline-none focus:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <span className="text-xl font-bold">✕</span> // Nút X tắt menu
            ) : (
              <span className="text-xl font-bold">☰</span> // Nút 3 gạch mở menu
            )}
          </button>
        </div>
      </div>

      {/* ================= PANEL MENU DI ĐỘNG (MOBILE OVERLAY MENU) ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full h-[calc(100vh-64px)] bg-white border-t border-slate-100 z-50 overflow-y-auto animate-fadeIn px-6 py-4 space-y-4 text-slate-800 text-sm font-semibold">
          <Link href="/" onClick={closeAllMenus} className="block py-2 border-b border-slate-100 hover:text-emerald-600">Trang chủ</Link>
          
          {/* Cụm Tour di động */}
          <div className="border-b border-slate-100 py-1">
            <button 
              onClick={() => setIsMobileTourOpen(!isMobileTourOpen)}
              className="w-full flex items-center justify-between py-2 text-left hover:text-emerald-600"
            >
              <span>Danh sách Tour</span>
              <span className="text-xs text-slate-400">{isMobileTourOpen ? "▲" : "▼"}</span>
            </button>
            
            {isMobileTourOpen && (
              <div className="pl-4 pr-2 py-1 bg-slate-50 rounded-lg mt-1 space-y-2 text-xs text-slate-600">
                <Link href="/tours" onClick={closeAllMenus} className="block py-1.5 uppercase font-bold text-slate-400">Tất cả điểm đến</Link>
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      closeAllMenus();
                      router.push(`/tours?location=${loc.id}`);
                    }}
                    className="w-full text-left py-1.5 block hover:text-emerald-600"
                  >
                    Tour {loc.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cụm Về chúng tôi di động */}
          <div className="border-b border-slate-100 py-1">
            <button 
              onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
              className="w-full flex items-center justify-between py-2 text-left hover:text-emerald-600"
            >
              <span>Về chúng tôi</span>
              <span className="text-xs text-slate-400">{isMobileAboutOpen ? "▲" : "▼"}</span>
            </button>

            {isMobileAboutOpen && (
              <div className="pl-4 pr-2 py-1 bg-slate-50 rounded-lg mt-1 space-y-2 text-xs text-slate-600">
                <Link href="/about/introduction" onClick={closeAllMenus} className="block py-1.5">Giới thiệu công ty</Link>
                <Link href="/about/privacy-policy" onClick={closeAllMenus} className="block py-1.5">Chính sách riêng tư</Link>
                <Link href="/about/refund-policy" onClick={closeAllMenus} className="block py-1.5">Chính sách hoàn hủy</Link>
                <Link href="/about/payment-methods" onClick={closeAllMenus} className="block py-1.5">Phương thức thanh toán</Link>
                <Link href="/about/terms-of-use" onClick={closeAllMenus} className="block py-1.5">Điều khoản sử dụng</Link>
              </div>
            )}
          </div>

          <Link href="/blog" onClick={closeAllMenus} className="block py-2 border-b border-slate-100 hover:text-emerald-600">Cẩm nang du lịch</Link>
          <Link href="/contact" onClick={closeAllMenus} className="block py-2 border-b border-slate-100 hover:text-emerald-600">Liên hệ</Link>

          {/* Nút Hotline Mobile */}
          <div className="pt-4">
            <a href="tel:0900123456" className="w-full text-center block text-sm font-bold text-slate-950 bg-amber-400 py-3 rounded-xl hover:bg-amber-500 transition-colors">
              Gọi Ngay Hotline: 090 123 456
            </a>
          </div>
        </div>
      )}
    </header> 
  );
}