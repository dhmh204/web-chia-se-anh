import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { ten_album, ma_du_an, loai_album, quyen_download } = await request.json();

    // Validation
    if (!ten_album?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên album" },
        { status: 400 },
      );
    }
    if (!ma_du_an) {
      return NextResponse.json(
        { message: "Vui lòng chọn dự án" },
        { status: 400 },
      );
    }
    if (!loai_album) {
      return NextResponse.json(
        { message: "Vui lòng chọn loại album" },
        { status: 400 },
      );
    }

    // Map string to LoaiAlb enum
    const validLoaiAlbs = ["ANH_GOC", "HAU_KY", "CUOI_CUNG"];
    if (!validLoaiAlbs.includes(loai_album)) {
      return NextResponse.json(
        { message: "Loại album không hợp lệ" },
        { status: 400 },
      );
    }

    // Create Album in DB
    const newAlbum = await prisma.album.create({
      data: {
        ten_alb: ten_album.trim(),
        ma_du_an: ma_du_an,
        loai_alb: loai_album as any,
        quyen_download: !!quyen_download,
        nguoi_tao: session.user.ma_nguoi_dung as string,
      },
    });

    return NextResponse.json(
      {
        message: "Tạo album mới thành công",
        album: newAlbum,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("CREATE_ALBUM_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi tạo album" },
      { status: 500 },
    );
  }
}

// PATCH handler to configure album settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { ma_album, ten_album, loai_album, quyen_download } = body;

    if (!ma_album) {
      return NextResponse.json(
        { message: "Mã album là bắt buộc để cập nhật" },
        { status: 400 },
      );
    }

    const album = await prisma.album.findUnique({
      where: { ma_album },
    });

    if (!album) {
      return NextResponse.json(
        { message: "Album không tồn tại" },
        { status: 404 },
      );
    }

    const updateData: any = {};
    if (ten_album !== undefined) updateData.ten_alb = ten_album.trim();
    if (quyen_download !== undefined) updateData.quyen_download = !!quyen_download;

    if (loai_album !== undefined) {
      const validLoaiAlbs = ["ANH_GOC", "HAU_KY", "CUOI_CUNG"];
      if (!validLoaiAlbs.includes(loai_album)) {
        return NextResponse.json(
          { message: "Loại album không hợp lệ" },
          { status: 400 },
        );
      }
      updateData.loai_alb = loai_album;
    }

    const updatedAlbum = await prisma.album.update({
      where: { ma_album },
      data: updateData,
    });

    return NextResponse.json({
      message: "Cập nhật album thành công",
      album: updatedAlbum,
    });
  } catch (error: any) {
    console.error("UPDATE_ALBUM_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi cập nhật album" },
      { status: 500 },
    );
  }
}

// DELETE handler to remove album
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const ma_album = searchParams.get("id");

    if (!ma_album) {
      return NextResponse.json(
        { message: "Mã album là bắt buộc để xóa" },
        { status: 400 },
      );
    }

    const album = await prisma.album.findUnique({
      where: { ma_album },
    });

    if (!album) {
      return NextResponse.json(
        { message: "Album không tồn tại" },
        { status: 404 },
      );
    }

    await prisma.album.delete({
      where: { ma_album },
    });

    return NextResponse.json({
      message: "Đã xóa album thành công",
    });
  } catch (error: any) {
    console.error("DELETE_ALBUM_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi xóa album" },
      { status: 500 },
    );
  }
}

