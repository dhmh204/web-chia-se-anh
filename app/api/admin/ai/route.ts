import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 1. Authorize user (Admin or Photographer)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const { ma_album, threshold } = await req.json();
    if (!ma_album) {
      return NextResponse.json({ message: "Thiếu mã album" }, { status: 400 });
    }

    // 2. Fetch all images in the album
    const photos = await prisma.hinhAnh.findMany({
      where: { ma_album },
      select: { ma_hinh_anh: true, url_anh: true },
    });

    if (photos.length === 0) {
      return NextResponse.json(
        { message: "Album không có hình ảnh nào để phân tách" },
        { status: 400 }
      );
    }

    // 3. Request face clustering from the Python service
    let response;
    try {
      response = await fetch("http://127.0.0.1:8000/api/process-album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos, threshold: threshold ?? 0.60 }),
      });
    } catch (err) {
      return NextResponse.json(
        {
          message:
            "Không thể kết nối với dịch vụ xử lý AI. Vui lòng đảm bảo dịch vụ Python đang chạy trên cổng 8000.",
        },
        { status: 500 }
      );
    }

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: data.detail || "Lỗi xử lý hình ảnh từ dịch vụ AI." },
        { status: 500 }
      );
    }

    // 4. Save results to PostgreSQL database in a transaction
    await prisma.$transaction(async (tx) => {
      // Clean up previous face groups for this album (Cascades to KHUONMATTRONGANH)
      await tx.khuonMat.deleteMany({
        where: { ma_album },
      });

      // Save new face groups and detected instances
      let index = 1;
      for (const group of data.groups) {
        const newGroup = await tx.khuonMat.create({
          data: {
            ma_album,
            ten_nhan_vat: `Người lạ ${index++}`,
            anh_dai_dien: group.anh_dai_dien,
          },
        });

        for (const face of group.faces) {
          await tx.khuonMatTrongAnh.create({
            data: {
              ma_hinh_anh: face.ma_hinh_anh,
              ma_nhom: newGroup.ma_nhom,
              vector_khuon_mat: face.vector,
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      groupsCount: data.groups.length,
    });
  } catch (error: any) {
    console.error("AI processing error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi xử lý AI" },
      { status: 500 }
    );
  }
}
