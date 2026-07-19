// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { tourApi } from "@/lib/api"; // Import file api của ông để đồng bộ

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // ĐỒNG BỘ GỬI EMAIL SANG CONTROLLER C# ĐỂ ĐỘI MARKETING CHẠY REMARKETING ADS
          await tourApi.syncGoogleLead({
            email: user.email,
            name: user.name || null,
            provider: "Google"
          });
        } catch (err) {
          console.error("Lỗi đồng bộ email sang .NET Core:", err);
        }
      }
      return true; // Cho phép khách đăng nhập thành công vào Client bình thường
    },
    async redirect({ baseUrl }) {
      return baseUrl; // Đăng nhập xong quay về trang chủ Client công khai
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };