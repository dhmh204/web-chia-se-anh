import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Tài khoản hệ thống",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "admin@tiemanh.com",
        },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ email và mật khẩu");
        }

        const user = await prisma.nguoiDung.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.mat_khau_hash) {
          throw new Error("Tài khoản không tồn tại trong hệ thống");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.mat_khau_hash,
        );

        if (!isPasswordValid) {
          throw new Error("Mật khẩu không chính xác");
        }

        return {
          id: user.ma_nguoi_dung,
          email: user.email,
          name: user.ho_va_ten,
          role: user.vai_tro,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.ma_nguoi_dung = user.id;
        token.vai_tro = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.ma_nguoi_dung = token.ma_nguoi_dung;
        session.user.vai_tro = token.vai_tro;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "f3fb8f44d18c1bcfbc20eb9db6159ba0c4a4a58ff093b59302613d7e9b0ad88f",
};
