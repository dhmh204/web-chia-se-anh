import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ma_hinh_anh,
      phan_hoi,
      nguoi_binh_luan,
      toa_do_X,
      toa_do_Y,
      phan_tram_chieu_rong,
      phan_tram_chieu_cao,
    } = body;

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

    // Verify if photo exists
    const photo = await prisma.hinhAnh.findUnique({
      where: { ma_hinh_anh },
    });

    if (!photo) {
      return NextResponse.json(
        { message: "Hình ảnh không tồn tại" },
        { status: 404 }
      );
    }

    // Assign fallback values if coordinates are not provided (e.g., general feedback)
    const x = typeof toa_do_X === "number" ? toa_do_X : 50.0;
    const y = typeof toa_do_Y === "number" ? toa_do_Y : 50.0;
    const w = typeof phan_tram_chieu_rong === "number" ? phan_tram_chieu_rong : 10.0;
    const h = typeof phan_tram_chieu_cao === "number" ? phan_tram_chieu_cao : 10.0;

    const newFeedback = await prisma.phanHoi.create({
      data: {
        ma_hinh_anh,
        phan_hoi: phan_hoi.trim(),
        nguoi_binh_luan: nguoi_binh_luan?.trim() || "Khách",
        toa_do_X: x,
        toa_do_Y: y,
        phan_tram_chieu_rong: w,
        phan_tram_chieu_cao: h,
        trang_thai: "CHUA_XU_LY",
      },
    });

    return NextResponse.json({
      message: "Gửi phản hồi thành công",
      feedback: {
        ...newFeedback,
        toa_do_X: Number(newFeedback.toa_do_X),
        toa_do_Y: Number(newFeedback.toa_do_Y),
        phan_tram_chieu_rong: Number(newFeedback.phan_tram_chieu_rong),
        phan_tram_chieu_cao: Number(newFeedback.phan_tram_chieu_cao),
      },
    });
  } catch (error: any) {
    console.error("CLIENT_CREATE_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi gửi phản hồi" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_phan_hoi, phan_hoi } = body;

    if (!ma_phan_hoi) {
      return NextResponse.json(
        { message: "Mã phản hồi là bắt buộc" },
        { status: 400 }
      );
    }

    if (!phan_hoi?.trim()) {
      return NextResponse.json(
        { message: "Nội dung phản hồi không được để trống" },
        { status: 400 }
      );
    }

    const updatedFeedback = await prisma.phanHoi.update({
      where: { ma_phan_hoi },
      data: { phan_hoi: phan_hoi.trim() },
    });

    return NextResponse.json({
      message: "Cập nhật bình luận thành công",
      feedback: {
        ...updatedFeedback,
        toa_do_X: Number(updatedFeedback.toa_do_X),
        toa_do_Y: Number(updatedFeedback.toa_do_Y),
        phan_tram_chieu_rong: Number(updatedFeedback.phan_tram_chieu_rong),
        phan_tram_chieu_cao: Number(updatedFeedback.phan_tram_chieu_cao),
      },
    });
  } catch (error: any) {
    console.error("CLIENT_PUT_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi chỉnh sửa bình luận" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Mã phản hồi là bắt buộc" },
        { status: 400 }
      );
    }

    await prisma.phanHoi.delete({
      where: { ma_phan_hoi: id },
    });

    return NextResponse.json({
      message: "Xóa phản hồi thành công",
    });
  } catch (error: any) {
    console.error("CLIENT_DELETE_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi xóa phản hồi" },
      { status: 500 }
    );
  }
}
