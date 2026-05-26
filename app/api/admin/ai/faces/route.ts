import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET: Retrieve all face groups for an album
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const ma_album = searchParams.get("ma_album");

    if (!ma_album) {
      return NextResponse.json({ message: "Thiếu mã album" }, { status: 400 });
    }

    const faces = await prisma.khuonMat.findMany({
      where: { ma_album },
      include: {
        khuon_mat_trong_anh: {
          include: {
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ten_nhan_vat: "asc",
      },
    });

    const formattedFaces = faces.map((f) => {
      // Map detected face instances back to their parent images
      const photos = f.khuon_mat_trong_anh.map((km) => km.hinh_anh);
      
      // Deduplicate photos (in case a person's face was detected multiple times in one photo)
      const uniquePhotos = Array.from(
        new Map(photos.map((p) => [p.ma_hinh_anh, p])).values()
      );

      return {
        ma_nhom: f.ma_nhom,
        ten_nhan_vat: f.ten_nhan_vat,
        anh_dai_dien: f.anh_dai_dien,
        photosCount: uniquePhotos.length,
        photos: uniquePhotos,
      };
    });

    return NextResponse.json(formattedFaces);
  } catch (error: any) {
    console.error("GET faces error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi lấy danh sách khuôn mặt" },
      { status: 500 }
    );
  }
}

// PUT: Rename a face group
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const { ma_nhom, ten_nhan_vat } = await req.json();

    if (!ma_nhom || !ten_nhan_vat) {
      return NextResponse.json(
        { message: "Thiếu mã nhóm hoặc tên nhân vật" },
        { status: 400 }
      );
    }

    const updatedGroup = await prisma.khuonMat.update({
      where: { ma_nhom },
      data: {
        ten_nhan_vat: ten_nhan_vat.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      face: updatedGroup,
    });
  } catch (error: any) {
    console.error("PUT rename face error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi đổi tên nhân vật" },
      { status: 500 }
    );
  }
}
