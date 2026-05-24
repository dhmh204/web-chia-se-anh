import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim() || "";

    if (!phone) {
      return NextResponse.json(
        { message: "Vui lòng cung cấp số điện thoại" },
        { status: 400 },
      );
    }

    const customer = await prisma.khachHang.findUnique({
      where: { so_dien_thoai: phone },
      select: {
        ma_khach_hang: true,
        ho_va_ten: true,
        so_dien_thoai: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json(
      { exists: true, customer },
      { status: 200 },
    );
  } catch (error) {
    console.error("SEARCH_CUSTOMER_ERROR", error);
    return NextResponse.json(
      { message: "Lỗi server khi tìm kiếm khách hàng" },
      { status: 500 },
    );
  }
}
