import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    // 1. Luồng đăng nhập bằng GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // 2. Luồng đăng nhập bằng TÀI KHOẢN / MẬT KHẨU (Local)
    CredentialsProvider({
      name: "Tài khoản hệ thống",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hang@tiemanh.com" },
        password: { label: "Mật khẩu", type: "password" }
      },
      async authorize(credentials) {
        // Kiểm tra xem có nhập đủ thông tin không
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
        }

        // Tìm user trong database
        const user = await prisma.nguoiDung.findUnique({
          where: { email: credentials.email }
        });

        // Nếu không có user, hoặc user này vốn đăng nhập bằng Google (không có mật khẩu)
        if (!user || !user.mat_khau_hash) {
          throw new Error("Tài khoản không tồn tại hoặc bạn thường dùng Google để đăng nhập");
        }

        // So sánh mật khẩu khách nhập với mật khẩu đã mã hóa trong DB
        const isPasswordValid = await bcrypt.compare(credentials.password, user.mat_khau_hash);

        if (!isPasswordValid) {
          throw new Error("Mật khẩu không chính xác");
        }

        // Đăng nhập thành công!
        return user;
      }
    })
  ],
  callbacks: {
    // Xử lý chung cho cả 2 luồng
    async signIn({ user, account }) {
      // Nếu là Google, vẫn phải kiểm tra xem Admin đã tạo quyền cho email này chưa
      if (account?.provider === "google") {
        const existingUser = await prisma.nguoiDung.findUnique({
          where: { email: user.email as string },
        });
        if (!existingUser) {
          console.log("Truy cập trái phép bị chặn:", user.email);
          return false; 
        }
      }
      return true; // Local thì đã qua bước authorize ở trên nên luôn true
    },

    async jwt({ token, user }) {
      if (token.email) {
        const dbUser = await prisma.nguoiDung.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.ma_nguoi_dung = dbUser.ma_nguoi_dung;
          token.vai_tro = dbUser.vai_tro;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.ma_nguoi_dung = token.ma_nguoi_dung;
        // @ts-ignore
        session.user.vai_tro = token.vai_tro;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };