import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_hinh_anh, phan_hoi, nguoi_binh_luan } = body;

    if (!ma_hinh_anh) {
      return NextResponse.json(
        { message: "Mã hình ảnh là bắt buộc" },
        { status: 400 }
      );
    }

    if (!phan_hoi?.trim()) {
      return NextResponse.json(
        { message: "Nội dung phản hồi không được để trống" },
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

    // Create feedback (PhanHoi) in DB
    const newFeedback = await prisma.phanHoi.create({
      data: {
        ma_hinh_anh,
        phan_hoi: phan_hoi.trim(),
        nguoi_binh_luan: nguoi_binh_luan?.trim() || "Quản trị viên",
        toa_do_X: 50.0, // Default coordinates for center of the photo
        toa_do_Y: 50.0,
        phan_tram_chieu_rong: 10.0,
        phan_tram_chieu_cao: 10.0,
      },
    });

    return NextResponse.json({
      message: "Gửi phản hồi thành công",
      feedback: newFeedback,
    });
  } catch (error: any) {
    console.error("CREATE_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi tạo phản hồi" },
      { status: 500 }
    );
  }
}
