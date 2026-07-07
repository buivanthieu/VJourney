// app/sitemap.ts
import { MetadataRoute } from "next";
import { tourApi } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"; // Thay bằng tên miền thực tế sau này

  // 1. Định nghĩa các trang tĩnh cố định
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0, // Trang chủ ưu tiên cao nhất
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // 2. Lấy danh sách toàn bộ tour từ API .NET để tự động sinh link động
  const tours = await tourApi.getAllTours();
  const tourRoutes = tours.map((tour: { slug: any; }) => ({
    url: `${baseUrl}/tours/${tour.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Gộp trang tĩnh và trang động lại làm một
  return [...staticRoutes, ...tourRoutes];
}