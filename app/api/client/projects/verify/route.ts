import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_du_an, mat_khau } = body;

    if (!ma_du_an) {
      return NextResponse.json(
        { message: "Mã dự án là bắt buộc" },
        { status: 400 }
      );
    }

    const project = await prisma.duan.findUnique({
      where: { ma_du_an },
      select: {
        mat_khau: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Dự án không tồn tại" },
        { status: 404 }
      );
    }

    // If project has no password set, return success
    if (!project.mat_khau || project.mat_khau.trim() === "") {
      const response = NextResponse.json({ success: true });
      response.cookies.set(`project_unlocked_${ma_du_an}`, "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    // Verify password match
    if (project.mat_khau === mat_khau?.trim()) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(`project_unlocked_${ma_du_an}`, "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: false, // Accessible client-side if needed
        sameSite: "lax",
      });
      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Mật khẩu truy cập không chính xác." },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("VERIFY_PROJECT_PASSWORD_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi xác thực" },
      { status: 500 }
    );
  }
}
