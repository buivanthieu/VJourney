// lib/api.ts
import { TourItem } from "@/components/TourCard";

// Thay cổng port bằng đúng cổng chạy dự án .NET Web API của bạn (ví dụ: localhost:5001 hoặc 7000)
const API_BASE_URL = "http://localhost:5187/api";

export const tourApi = {
  /**
   * Lấy danh sách toàn bộ các tour từ Backend .NET
   */
  getAllTours: async (): Promise<TourItem[]> => {
    try {
      console.log("API_BASE_URL =", API_BASE_URL);
      console.log("URL =", `${API_BASE_URL}/tours`);
      const response = await fetch(`${API_BASE_URL}/tours`, {
        // next: { revalidate: 60 } // Tùy chọn: Cache dữ liệu trong 60 giây để tối ưu tốc độ và SEO
        cache: "no-store", // Chế độ không cache để luôn lấy dữ liệu mới nhất khi đang dev
      });
      
      if (!response.ok) {
        throw new Error("Không thể kết nối đến hệ thống Backend.");
      }
      console.log("Fetch Tất Cả Tours Thành Công:", response);
      return await response.json();
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          console.error("Cause:", error.cause);
        }

        return [];
      }
  },

  /**
   * Lấy chi tiết 1 tour dựa vào Slug (Phục vụ trang chi tiết /tours/[slug])
   */
  getTourBySlug: async (slug: string): Promise<any | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours/${slug}`, {
        cache: "no-store",
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Lỗi Fetch Tour với slug ${slug}:`, error);
      return null;
    }
  },

  // Thêm vào bên trong đối tượng tourApi trong file lib/api.ts

  /**
   * Gửi dữ liệu tạo mới một Tour lên Backend .NET
   */
  createTour: async (tourData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu API .NET của bạn yêu cầu quyền, ta sẽ truyền Token ở đây (Sẽ làm ở Chương 4)
          // "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi khi lưu tour vào cơ sở dữ liệu.");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Lỗi POST Tour:", error);
      return { success: false, error: error.message || "Hệ thống gặp sự cố kết nối." };
    }
  },
};


