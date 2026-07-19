// // lib/api.ts
// const API_BASE_URL = "http://localhost:5187/api";

// export const tourApi = {
//   // ==================== PHÂN HỆ TOUR ====================
//   getAllTours: async () => {
//     const res = await fetch(`${API_BASE_URL}/tours`, { cache: "no-store" });
//     return res.ok ? await res.json() : [];
//   },
//   getTourBySlug: async (slug: string) => {
//     const res = await fetch(`${API_BASE_URL}/tours/${slug}`, { cache: "no-store" });
//     return res.ok ? await res.json() : null;
//   },
//   createTour: async (data: any) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/tours`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       return { success: res.ok, error: res.ok ? null : "Lỗi Server" };
//     } catch (err: any) {
//       return { success: false, error: err.message };
//     }
//   },
//   updateTour: async (id: string, data: any) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/tours/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       return { success: res.ok };
//     } catch (err) {
//       return { success: false };
//     }
//   },
//   deleteTour: async (id: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/tours/${id}`, { method: "DELETE" });
//       return { success: res.ok };
//     } catch (err) {
//       return { success: false };
//     }
//   },

//   // ==================== PHÂN HỆ LOCATIONS & CATEGORIES ====================
//   getLocations: async () => {
//     const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
//     return res.ok ? await res.json() : [];
//   },
//   getBlogCategories: async () => {
//     const res = await fetch(`${API_BASE_URL}/blog-categories`, { cache: "no-store" });
//     return res.ok ? await res.json() : [];
//   },

//   // ==================== PHÂN HỆ BLOG / POSTS (CRUD ĐẦY ĐỦ) ====================
//   getAllPosts: async () => {
//     const res = await fetch(`${API_BASE_URL}/posts`, { cache: "no-store" });
//     return res.ok ? await res.json() : [];
//   },
//   getPostBySlug: async (slug: string) => {
//     const res = await fetch(`${API_BASE_URL}/posts/${slug}`, { cache: "no-store" });
//     return res.ok ? await res.json() : null;
//   },
//   createPost: async (data: any) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       return { success: res.ok, error: res.ok ? null : "Lỗi lưu bài viết" };
//     } catch (err: any) {
//       return { success: false, error: err.message };
//     }
//   },
//   updatePost: async (id: string, data: any) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       return { success: res.ok };
//     } catch (err) {
//       return { success: false };
//     }
//   },
//   deletePost: async (id: string) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/posts/${id}`, { method: "DELETE" });
//       return { success: res.ok };
//     } catch (err) {
//       return { success: false };
//     }
//   },
// };

// lib/api.ts
// const API_BASE_URL = "http://localhost:5187/api";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ĐỒNG BỘ ĐỊNH DẠNG THEO ĐÚNG CÁC CLASS DTO MỚI BÊN BACKEND C#
export interface LocationResponseDto {
  id: number; // Chuyển sang int
  name: string;
  slug: string;
  description: string;
}

export interface BlogCategoryResponseDto {
  id: number; // Chuyển sang int
  name: string;
  slug: string;
}

export interface TourResponseDto {
  id: number; // Chuyển sang int
  title: string;
  slug: string;
  image: string;
  duration: string;
  price: number;
  locationId: number; // Chuyển sang int
  locationName: string; // Phẳng hóa dữ liệu theo Dto mới
  startLocation: string;
  content: string;
}

export interface PostResponseDto {
  id: number; // Chuyển sang int
  title: string;
  slug: string;
  image: string;
  summary: string;
  content: string;
  createdAt: string;
  blogCategoryId: number; // Chuyển sang int
  blogCategoryName: string; // Phẳng hóa dữ liệu theo Dto mới
}
export interface ContactResponseDto {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  createdAt: string;
}

export interface AuthResponseDto {
  token: string;
  username: string;
}
export const tourApi = {
  // ==================== PHÂN HỆ TOUR ====================
  getAllTours: async (): Promise<TourResponseDto[]> => {
    const res = await fetch(`${API_BASE_URL}/tours`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  },
  getTourBySlug: async (slug: string): Promise<TourResponseDto | null> => {
    const res = await fetch(`${API_BASE_URL}/tours/slug/${slug}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  },
  createTour: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok, error: res.ok ? null : "Lỗi Server" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  updateTour: async (id: number, data: any) => { // id kiểu number
    try {
      const res = await fetch(`${API_BASE_URL}/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  },
  deleteTour: async (id: number) => { // id kiểu number
    try {
      const res = await fetch(`${API_BASE_URL}/tours/${id}`, { method: "DELETE" });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  },

  // ==================== PHÂN HỆ LOCATIONS & CATEGORIES ====================
  getLocations: async (): Promise<LocationResponseDto[]> => {
    const res = await fetch(`${API_BASE_URL}/locations`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  },
  getBlogCategories: async (): Promise<BlogCategoryResponseDto[]> => {
    const res = await fetch(`${API_BASE_URL}/BlogCategories`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  },

  // ==================== PHÂN HỆ BLOG / POSTS ====================
  getAllPosts: async (): Promise<PostResponseDto[]> => {
    const res = await fetch(`${API_BASE_URL}/posts`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  },
  getPostBySlug: async (slug: string): Promise<PostResponseDto | null> => {
    const res = await fetch(`${API_BASE_URL}/posts/slug/${slug}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  },
  createPost: async (data: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok, error: res.ok ? null : "Lỗi lưu bài viết" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
  updatePost: async (id: number, data: any) => { // id kiểu number
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  },
  deletePost: async (id: number) => { // id kiểu number
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${id}`, { method: "DELETE" });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  },

  // ==================== PHÂN HỆ CONTACT (CRUD ĐỀU CHẠY SERVICE C#) ====================
  // API lấy toàn bộ danh sách liên hệ dành cho Admin Dashboard
  getAllContacts: async (): Promise<ContactResponseDto[]> => {
    const res = await fetch(`${API_BASE_URL}/contact`, { cache: "no-store" });
    return res.ok ? await res.json() : [];
  },

  // API lấy chi tiết một liên hệ theo ID nếu cần xem sâu
  getContactById: async (id: number): Promise<ContactResponseDto | null> => {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  },

  // API Client gửi form đăng ký tư vấn lên Postgres
  createContact: async (data: { name: string; phone: string; email?: string; message?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok, data: res.ok ? await res.json() : null };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // API Admin xóa bỏ một form liên hệ rác / đã xử lý
  deleteContact: async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact/${id}`, { method: "DELETE" });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  },

  // ==================== PHÂN HỆ AUTH ADMIN & MARKETING LEAD GOOGLE ====================
  // API Đăng nhập Admin lấy chuỗi bảo mật JWT Token từ C# Service
  adminLogin: async (data: { username: string; password: string }): Promise<{ success: boolean; token?: string; username?: string; message?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return { success: res.ok, ...result };
    } catch (err: any) {
      return { success: false, message: "Không thể kết nối đến máy chủ xác thực!" };
    }
  },

  // API bắn Gmail thu được từ nút bấm Google Sign-In sang C# lưu bảng Leads
  syncGoogleLead: async (data: { email: string; name: string | null; provider: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return { success: res.ok };
    } catch (err) {
      return { success: false };
    }
  }
};