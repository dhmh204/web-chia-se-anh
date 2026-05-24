import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_album, mat_khau } = body;

    if (!ma_album) {
      return NextResponse.json(
        { message: "Mã album là bắt buộc" },
        { status: 400 }
      );
    }

    const album = await prisma.album.findUnique({
      where: { ma_album },
      include: {
        du_an: {
          select: {
            mat_khau: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { message: "Album không tồn tại" },
        { status: 404 }
      );
    }

    const projectPassword = album.du_an?.mat_khau;

    // If album project has no password, always succeed
    if (!projectPassword) {
      return NextResponse.json({ success: true });
    }

    // Check if password matches
    if (projectPassword === mat_khau?.trim()) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Mật khẩu album không chính xác." },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("VERIFY_ALBUM_PASSWORD_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi xác thực" },
      { status: 500 }
    );
  }
}
