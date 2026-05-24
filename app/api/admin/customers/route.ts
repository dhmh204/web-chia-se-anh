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

    const { ho_va_ten, so_dien_thoai, ma_du_an } = await request.json();

    // Validation
    if (!ho_va_ten?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng nhập họ tên" },
        { status: 400 },
      );
    }
    if (!so_dien_thoai?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng nhập số điện thoại" },
        { status: 400 },
      );
    }
    if (so_dien_thoai.trim().length < 10) {
      return NextResponse.json(
        { message: "Số điện thoại phải chứa ít nhất 10 chữ số" },
        { status: 400 },
      );
    }

    // Check if phone number already exists
    const existing = await prisma.khachHang.findUnique({
      where: { so_dien_thoai: so_dien_thoai.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Số điện thoại này đã được sử dụng bởi khách hàng khác" },
        { status: 400 },
      );
    }

    // Create Customer
    const newCustomer = await prisma.khachHang.create({
      data: {
        ho_va_ten: ho_va_ten.trim(),
        so_dien_thoai: so_dien_thoai.trim(),
      },
    });

    // If ma_du_an was specified, link this customer to that project
    if (ma_du_an) {
      await prisma.duan.update({
        where: { ma_du_an },
        data: {
          ma_khach_hang: newCustomer.ma_khach_hang,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Tạo khách hàng mới thành công",
        customer: newCustomer,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("CREATE_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi tạo khách hàng" },
      { status: 500 },
    );
  }
}

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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Thiếu mã khách hàng" },
        { status: 400 },
      );
    }

    await prisma.khachHang.delete({
      where: { ma_khach_hang: id },
    });

    return NextResponse.json({
      message: "Xóa khách hàng thành công",
    });
  } catch (error: any) {
    console.error("DELETE_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi xóa khách hàng" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { ma_khach_hang, ho_va_ten, so_dien_thoai } = await request.json();

    if (!ma_khach_hang) {
      return NextResponse.json(
        { message: "Thiếu mã khách hàng" },
        { status: 400 },
      );
    }

    // Validation
    if (!ho_va_ten?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng nhập họ tên" },
        { status: 400 },
      );
    }
    if (!so_dien_thoai?.trim()) {
      return NextResponse.json(
        { message: "Vui lòng nhập số điện thoại" },
        { status: 400 },
      );
    }
    if (so_dien_thoai.trim().length < 10) {
      return NextResponse.json(
        { message: "Số điện thoại phải chứa ít nhất 10 chữ số" },
        { status: 400 },
      );
    }

    // Check if phone number already exists for another customer
    const existing = await prisma.khachHang.findFirst({
      where: {
        so_dien_thoai: so_dien_thoai.trim(),
        NOT: {
          ma_khach_hang,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Số điện thoại này đã được sử dụng bởi khách hàng khác" },
        { status: 400 },
      );
    }

    // Update Customer
    const updatedCustomer = await prisma.khachHang.update({
      where: { ma_khach_hang },
      data: {
        ho_va_ten: ho_va_ten.trim(),
        so_dien_thoai: so_dien_thoai.trim(),
      },
    });

    return NextResponse.json(
      {
        message: "Cập nhật khách hàng thành công",
        customer: updatedCustomer,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("PATCH_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi máy chủ khi cập nhật khách hàng" },
      { status: 500 },
    );
  }
}

