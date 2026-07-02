// lib/api.ts
import { TourItem } from "@/components/TourCard";

const API_BASE_URL = "http://localhost:5187/api";

export const tourApi = {
  // --- PHÂN HỆ TOUR (Giữ nguyên các hàm cũ của ông) ---
  getAllTours: async (): Promise<TourItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`, { cache: "no-store" });
      if (!response.ok) throw new Error("Không thể kết nối đến hệ thống Backend.");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getTourBySlug: async (slug: string): Promise<any | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${slug}`, { cache: "no-store" });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  createTour: async (tourData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tourData),
      });
      if (!response.ok) throw new Error("Lỗi khi lưu tour vào cơ sở dữ liệu.");
      return { success: true, data: await response.json() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // --- NÂNG CẤP: GOM CÁC HÀM ĐỊA ĐIỂM & BLOG VÀO ĐÂY ---
  
  /**
   * Lấy danh sách toàn bộ Địa điểm / Vùng miền để lọc Tour
   */
  getLocations: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Lỗi Fetch Địa điểm:", error);
      return [];
    }
  },

  /**
   * Lấy toàn bộ bài viết Cẩm nang / Blog
   */
  getAllPosts: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, { cache: "no-store" });
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Lỗi Fetch Bài viết:", error);
      return [];
    }
  },

  /**
   * Lấy chi tiết một bài viết Blog theo Slug để hiển thị bài đọc
   */
  getPostBySlug: async (slug: string): Promise<any | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${slug}`, { cache: "no-store" });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Lỗi Fetch Chi tiết bài viết:", error);
      return null;
    }
  }
};