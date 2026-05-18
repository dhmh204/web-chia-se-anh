import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, ho_va_ten, mat_khau, so_dien_thoai, vai_tro } = body;

    // 1. Kiểm tra xem email này đã tồn tại trong hệ thống chưa
    const userDaTonTai = await prisma.nguoiDung.findUnique({
      where: { email: email },
    });

    if (userDaTonTai) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng rồi!" },
        { status: 400 }
      );
    }

    // 2. Băm mật khẩu (Nếu có)
    // Trường hợp Admin chỉ muốn thợ ảnh đăng nhập bằng Google, họ có thể bỏ trống mật khẩu
    let matKhauHash = null;
    if (mat_khau) {
      matKhauHash = await bcrypt.hash(mat_khau, 10);
    }

    // 3. Lưu vào Database
    const userMoi = await prisma.nguoiDung.create({
      data: {
        email: email,
        ho_va_ten: ho_va_ten,
        so_dien_thoai: so_dien_thoai,
        mat_khau_hash: matKhauHash, // Lưu mật khẩu đã mã hóa, tuyệt đối KHÔNG lưu mat_khau gốc
        vai_tro: vai_tro || "THO_ANH", // Mặc định nếu không truyền thì là Thợ ảnh
        nen_tang_xac_thuc: mat_khau ? "LOCAL" : "GOOGLE",
      },
    });

    // 4. Trả về kết quả (Nhớ xóa cái pass hash đi trước khi trả về để bảo mật)
    const { mat_khau_hash: _, ...thongTinAnToan } = userMoi;

    return NextResponse.json(
      { message: "Tạo tài khoản thành công!", data: thongTinAnToan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi POST /api/nguoidung:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi tạo người dùng" },
      { status: 500 }
    );
  }
}