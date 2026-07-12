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
const API_BASE_URL = "http://localhost:5187/api";

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
};