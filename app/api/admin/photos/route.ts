import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

// GET handler to retrieve photos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ma_du_an = searchParams.get("ma_du_an");
    const ma_album = searchParams.get("ma_album");

    const whereClause: any = {};
    if (session.user.vai_tro === "THO_ANH") {
      whereClause.album = {
        du_an: {
          su_phan_cong: {
            some: {
              ma_nguoi_dung: session.user.ma_nguoi_dung,
            },
          },
        },
      };
    }

    if (ma_album && ma_album !== "all") {
      whereClause.ma_album = ma_album;
    } else if (ma_du_an && ma_du_an !== "all") {
      if (whereClause.album) {
        whereClause.album.ma_du_an = ma_du_an;
      } else {
        whereClause.album = {
          ma_du_an: ma_du_an,
        };
      }
    }

    const photos = await prisma.hinhAnh.findMany({
      where: whereClause,
      orderBy: {
        ngay_tao: "desc",
      },
      include: {
        album: {
          select: {
            ten_alb: true,
            loai_alb: true,
            du_an: {
              select: {
                ten_du_an: true,
                trang_thai: true,
              },
            },
          },
        },
        phan_hoi: {
          select: {
            ma_phan_hoi: true,
          },
        },
      },
    });

    return NextResponse.json(photos);
  } catch (error: any) {
    console.error("GET_PHOTOS_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi lấy danh sách ảnh" },
      { status: 500 }
    );
  }
}

// POST handler to upload photos
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const ma_album = formData.get("ma_album") as string;
    const files = formData.getAll("files") as File[];

    if (!ma_album) {
      return NextResponse.json(
        { message: "Vui lòng chọn Album để tải ảnh lên" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { message: "Không tìm thấy tệp tin nào để tải lên" },
        { status: 400 }
      );
    }

    // Verify album exists
    const album = await prisma.album.findUnique({
      where: { ma_album },
    });
    if (!album) {
      return NextResponse.json(
        { message: "Album không tồn tại" },
        { status: 404 }
      );
    }

    // Verify photographer assignment
    if (session.user.vai_tro === "THO_ANH") {
      const assignment = await prisma.suPhanCong.findUnique({
        where: {
          ma_nguoi_dung_ma_du_an: {
            ma_nguoi_dung: session.user.ma_nguoi_dung as string,
            ma_du_an: album.ma_du_an,
          },
        },
      });
      if (!assignment) {
        return NextResponse.json(
          { message: "Bạn không có quyền upload ảnh vào album của dự án này" },
          { status: 403 }
        );
      }
    }

    const uploadedPhotos = [];

    for (const file of files) {
      if (file.size === 0) continue;

      // 1. Upload to Cloudinary
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = file.type;
      const base64Data = buffer.toString("base64");
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      const uploadRes = await cloudinary.uploader.upload(fileUri, {
        folder: `albums/${ma_album}`,
      });

      // 2. Mock AI blur detection (20% chance of being blurred)
      const fileNameLower = file.name.toLowerCase();
      const isBlurred = fileNameLower.includes("blur") || Math.random() < 0.2;

      // 3. Save to database
      const newPhoto = await prisma.hinhAnh.create({
        data: {
          ma_album,
          url_anh: uploadRes.secure_url,
          bi_mo: isBlurred,
          yeu_thich: false,
        },
      });

      uploadedPhotos.push(newPhoto);
    }

    return NextResponse.json({
      message: `Đã tải lên thành công ${uploadedPhotos.length} ảnh`,
      photos: uploadedPhotos,
    });
  } catch (error: any) {
    console.error("UPLOAD_PHOTOS_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi tải ảnh lên" },
      { status: 500 }
    );
  }
}

// PATCH handler to update bi_mo or yeu_thich
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ma_hinh_anh, bi_mo, yeu_thich, run_ai } = body;

    if (!ma_hinh_anh) {
      return NextResponse.json(
        { message: "Mã hình ảnh là bắt buộc" },
        { status: 400 }
      );
    }

    const photo = await prisma.hinhAnh.findUnique({
      where: { ma_hinh_anh },
      include: {
        album: true,
      },
    });

    if (!photo) {
      return NextResponse.json(
        { message: "Hình ảnh không tồn tại" },
        { status: 404 }
      );
    }

    // Verify photographer assignment
    if (session.user.vai_tro === "THO_ANH") {
      const assignment = await prisma.suPhanCong.findUnique({
        where: {
          ma_nguoi_dung_ma_du_an: {
            ma_nguoi_dung: session.user.ma_nguoi_dung as string,
            ma_du_an: photo.album.ma_du_an,
          },
        },
      });
      if (!assignment) {
        return NextResponse.json(
          { message: "Bạn không có quyền chỉnh sửa ảnh của dự án này" },
          { status: 403 }
        );
      }
    }

    const updateData: any = {};
    if (bi_mo !== undefined) updateData.bi_mo = bi_mo;
    if (yeu_thich !== undefined) updateData.yeu_thich = yeu_thich;

    // Mock AI check trigger
    if (run_ai) {
      updateData.bi_mo = Math.random() < 0.4;
    }

    const updatedPhoto = await prisma.hinhAnh.update({
      where: { ma_hinh_anh },
      data: updateData,
    });

    return NextResponse.json({
      message: run_ai
        ? `Đã kích hoạt AI xử lý. Kết quả: ${updatedPhoto.bi_mo ? "Phát hiện ảnh bị mờ và ẩn!" : "Ảnh sắc nét."}`
        : "Cập nhật ảnh thành công",
      photo: updatedPhoto,
    });
  } catch (error: any) {
    console.error("UPDATE_PHOTO_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi cập nhật ảnh" },
      { status: 500 }
    );
  }
}

// DELETE handler to remove photo
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const ma_hinh_anh = searchParams.get("id");

    if (!ma_hinh_anh) {
      return NextResponse.json(
        { message: "Mã hình ảnh là bắt buộc" },
        { status: 400 }
      );
    }

    const photo = await prisma.hinhAnh.findUnique({
      where: { ma_hinh_anh },
      include: {
        album: true,
      },
    });

    if (!photo) {
      return NextResponse.json(
        { message: "Hình ảnh không tồn tại" },
        { status: 404 }
      );
    }

    // Verify photographer assignment
    if (session.user.vai_tro === "THO_ANH") {
      const assignment = await prisma.suPhanCong.findUnique({
        where: {
          ma_nguoi_dung_ma_du_an: {
            ma_nguoi_dung: session.user.ma_nguoi_dung as string,
            ma_du_an: photo.album.ma_du_an,
          },
        },
      });
      if (!assignment) {
        return NextResponse.json(
          { message: "Bạn không có quyền xóa ảnh của dự án này" },
          { status: 403 }
        );
      }
    }

    await prisma.hinhAnh.delete({
      where: { ma_hinh_anh },
    });

    return NextResponse.json({
      message: "Đã xóa ảnh thành công khỏi hệ thống",
    });
  } catch (error: any) {
    console.error("DELETE_PHOTO_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi xóa ảnh" },
      { status: 500 }
    );
  }
}
