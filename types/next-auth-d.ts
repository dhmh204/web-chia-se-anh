import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      ma_nguoi_dung?: string;
      vai_tro?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    ma_nguoi_dung?: string;
    vai_tro?: string;
  }
}