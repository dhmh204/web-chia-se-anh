import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_hinh_anh, yeu_thich } = body;

    if (!ma_hinh_anh) {
      return NextResponse.json(
        { message: "Mã hình ảnh là bắt buộc" },
        { status: 400 }
      );
    }

    const photo = await prisma.hinhAnh.findUnique({
      where: { ma_hinh_anh },
    });

    if (!photo) {
      return NextResponse.json(
        { message: "Hình ảnh không tồn tại" },
        { status: 404 }
      );
    }

    const updatedPhoto = await prisma.hinhAnh.update({
      where: { ma_hinh_anh },
      data: {
        yeu_thich: !!yeu_thich,
      },
    });

    return NextResponse.json({
      message: "Cập nhật lượt yêu thích thành công",
      photo: updatedPhoto,
    });
  } catch (error: any) {
    console.error("CLIENT_TOGGLE_FAVORITE_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi cập nhật lượt yêu thích" },
      { status: 500 }
    );
  }
}
