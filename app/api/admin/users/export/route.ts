import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VaiTro, TrangThaiTaiKHoan } from "@prisma/client";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Bạn chưa đăng nhập" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (session.user?.vai_tro !== "ADMIN") {
      return new Response(
        JSON.stringify({ message: "Bạn không có quyền xuất danh sách này" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const users = await prisma.nguoiDung.findMany({
      orderBy: {
        ngay_tao: "desc",
      },
    });

    const headers = [
      "Mã nhân sự",
      "Họ và tên",
      "Email",
      "Số điện thoại",
      "Vai trò",
      "Trạng thái",
      "Ngày tạo",
      "Ghi chú",
    ];

    const rows = users.map((user) => [
      user.ma_nguoi_dung,
      user.ho_va_ten,
      user.email,
      user.so_dien_thoai || "",
      user.vai_tro === VaiTro.ADMIN ? "Admin" : "Thợ ảnh",
      user.trang_thai === TrangThaiTaiKHoan.HOAT_DONG ? "Hoạt động" : "Đã khóa",
      new Date(user.ngay_tao).toLocaleString("vi-VN"),
      user.ghi_chu || "",
    ]);

    // Định dạng CSV an toàn cho ký tự đặc biệt, dấu phẩy và nháy kép
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((val) => {
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(","),
      ),
    ].join("\r\n");

    // Thêm BOM (Byte Order Mark) của UTF-8 ở đầu file để Excel hiểu tiếng Việt có dấu
    const csvBuffer = Buffer.concat([
      Buffer.from([0xef, 0xbb, 0xbf]),
      Buffer.from(csvContent, "utf-8"),
    ]);

    return new Response(csvBuffer, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Danh_sach_nhan_su.csv"',
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("EXPORT_USERS_ERROR", error);
    return new Response(
      JSON.stringify({ message: "Lỗi hệ thống khi xuất danh sách" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
