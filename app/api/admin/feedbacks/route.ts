import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

// GET: Fetch guest comments and their photographer replies
export async function GET(request: NextRequest) {
  try {
    // 1. Fetch guest comments (where ma_tho_anh is null)
    const guestComments = await prisma.phanHoi.findMany({
      where: {
        ma_tho_anh: null,
      },
      include: {
        hinh_anh: {
          select: {
            ma_hinh_anh: true,
            url_anh: true,
            ma_album: true,
            album: {
              select: {
                ten_alb: true,
                du_an: {
                  select: {
                    ten_du_an: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        ngay_tao: "desc",
      },
    });

    // 2. Fetch photographer replies (where ma_tho_anh is NOT null) for the relevant images
    const imageIds = Array.from(new Set(guestComments.map((c) => c.ma_hinh_anh)));
    const replies = await prisma.phanHoi.findMany({
      where: {
        ma_hinh_anh: { in: imageIds },
        ma_tho_anh: { not: null },
      },
      include: {
        tho_anh: {
          select: {
            ho_va_ten: true,
            vai_tro: true,
          },
        },
      },
      orderBy: {
        ngay_tao: "asc",
      },
    });

    // 3. Group replies into guest comments in memory
    const feedbacks = guestComments.map((comment) => {
      const photoReplies = replies.filter(
        (r) => r.ma_hinh_anh === comment.ma_hinh_anh
      );
      return {
        ...comment,
        replies: photoReplies,
      };
    });

    return NextResponse.json(feedbacks);
  } catch (error: any) {
    console.error("GET_FEEDBACKS_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi lấy danh sách phản hồi" },
      { status: 500 }
    );
  }
}

// POST: Add a new comment (photographer reply or client comment)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
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

    const userId = session?.user?.ma_nguoi_dung || null;
    const userName = session?.user?.name || "Admin Studio";

    const newFeedback = await prisma.phanHoi.create({
      data: {
        ma_hinh_anh,
        phan_hoi: phan_hoi.trim(),
        ma_tho_anh: userId,
        nguoi_binh_luan: userId
          ? userName
          : (nguoi_binh_luan?.trim() || "Khách"),
        toa_do_X: 50.0,
        toa_do_Y: 50.0,
        phan_tram_chieu_rong: 10.0,
        phan_tram_chieu_cao: 10.0,
      },
      include: {
        tho_anh: {
          select: {
            ho_va_ten: true,
            vai_tro: true,
          },
        },
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

// PATCH: Update the status of a comment/feedback
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ma_phan_hoi, trang_thai } = body;

    if (!ma_phan_hoi) {
      return NextResponse.json(
        { message: "Mã phản hồi là bắt buộc" },
        { status: 400 }
      );
    }

    if (!trang_thai) {
      return NextResponse.json(
        { message: "Trạng thái là bắt buộc" },
        { status: 400 }
      );
    }

    const updatedFeedback = await prisma.phanHoi.update({
      where: { ma_phan_hoi },
      data: { trang_thai },
    });

    return NextResponse.json({
      message: "Cập nhật trạng thái thành công",
      feedback: updatedFeedback,
    });
  } catch (error: any) {
    console.error("PATCH_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi cập nhật trạng thái" },
      { status: 500 }
    );
  }
}

// PUT: Edit a comment's content
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
      feedback: updatedFeedback,
    });
  } catch (error: any) {
    console.error("PUT_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi chỉnh sửa bình luận" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a comment
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
    console.error("DELETE_FEEDBACK_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi xóa phản hồi" },
      { status: 500 }
    );
  }
}
