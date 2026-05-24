import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma, TrangThaiTaiKHoan, VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

type CreateUserBody = {
  ho_va_ten?: string;
  email?: string;
  so_dien_thoai?: string;
  vai_tro?: VaiTro;
  trang_thai?: TrangThaiTaiKHoan;
  ghi_chu?: string;
  mat_khau_tam?: string;
  tu_sinh_mat_khau?: boolean;
  anh_dai_dien?: string;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (session.user?.vai_tro !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền tạo tài khoản" },
        { status: 403 },
      );
    }

    let ho_va_ten = "";
    let email = "";
    let so_dien_thoai: string | null = null;
    let vai_tro: VaiTro = VaiTro.THO_ANH;
    let trang_thai: TrangThaiTaiKHoan = TrangThaiTaiKHoan.HOAT_DONG;
    let ghi_chu = "";
    let tu_sinh_mat_khau = true;
    let matKhauTamInput = "";
    let avatarFile: File | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      ho_va_ten = (formData.get("name") as string)?.trim() || "";
      email = (formData.get("email") as string)?.trim().toLowerCase() || "";
      so_dien_thoai = (formData.get("telphone") as string)?.trim() || null;
      vai_tro = (formData.get("role") as VaiTro) || VaiTro.THO_ANH;
      trang_thai =
        (formData.get("stateAccount") as TrangThaiTaiKHoan) ||
        TrangThaiTaiKHoan.HOAT_DONG;
      ghi_chu = (formData.get("note") as string)?.trim() || "";
      tu_sinh_mat_khau = formData.get("passwordOptions") === "AUTO";
      matKhauTamInput = (formData.get("password") as string)?.trim() || "";
      avatarFile = formData.get("avatar") as File | null;
    } else {
      const body = (await request.json()) as CreateUserBody;
      ho_va_ten = body.ho_va_ten?.trim() || "";
      email = body.email?.trim().toLowerCase() || "";
      so_dien_thoai = body.so_dien_thoai?.trim() || null;
      vai_tro = body.vai_tro || VaiTro.THO_ANH;
      trang_thai = body.trang_thai || TrangThaiTaiKHoan.HOAT_DONG;
      ghi_chu = body.ghi_chu?.trim() || "";
      tu_sinh_mat_khau = body.tu_sinh_mat_khau !== false;
      matKhauTamInput = body.mat_khau_tam?.trim() || "";
    }

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        const sendProgress = (step: number) => {
          controller.enqueue(
            encoder.encode(JSON.stringify({ type: "progress", step }) + "\n"),
          );
        };

        try {
          // ==========================================
          // GIAI ĐOẠN 2: Xác thực dữ liệu
          // ==========================================
          sendProgress(2);
          await new Promise((r) => setTimeout(r, 450)); // Độ trễ ngắn để tạo cảm giác mượt mà

          if (!ho_va_ten) throw new Error("Vui lòng nhập họ và tên");
          if (!email) throw new Error("Vui lòng nhập email");
          if (!isValidEmail(email)) throw new Error("Email không hợp lệ");

          if (!Object.values(VaiTro).includes(vai_tro)) {
            throw new Error("Vai trò không hợp lệ");
          }
          if (!Object.values(TrangThaiTaiKHoan).includes(trang_thai)) {
            throw new Error("Trạng thái tài khoản không hợp lệ");
          }

          // Kiểm tra xem Email đã tồn tại chưa
          const existingUser = await prisma.nguoiDung.findUnique({
            where: { email },
          });
          if (existingUser) {
            throw new Error("Email đã tồn tại trong hệ thống");
          }

          // ==========================================
          // GIAI ĐOẠN 3: Cấu hình mật khẩu & Tải ảnh lên Cloudinary
          // ==========================================
          sendProgress(3);
          await new Promise((r) => setTimeout(r, 450));

          let matKhauTam = "";
          if (!tu_sinh_mat_khau) {
            matKhauTam = matKhauTamInput;
            if (!matKhauTam) throw new Error("Vui lòng nhập mật khẩu");
            if (matKhauTam.length < 6) {
              throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
            }
          } else {
            matKhauTam = generateTempPassword();
          }

          const mat_khau_hash = await bcrypt.hash(matKhauTam, 10);

          // Xử lý upload Cloudinary nếu có tệp avatar
          let anh_dai_dien: string | null = null;
          if (avatarFile && avatarFile.size > 0) {
            // Kiểm tra cấu hình Cloudinary
            if (
              !process.env.CLOUDINARY_CLOUD_NAME ||
              process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name" ||
              !process.env.CLOUDINARY_API_KEY ||
              process.env.CLOUDINARY_API_KEY === "your_api_key"
            ) {
              throw new Error(
                "Chưa cấu hình tài khoản Cloudinary trong file .env",
              );
            }

            try {
              const arrayBuffer = await avatarFile.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const mimeType = avatarFile.type;
              const base64Data = buffer.toString("base64");
              const fileUri = `data:${mimeType};base64,${base64Data}`;

              const uploadRes = await cloudinary.uploader.upload(fileUri, {
                folder: "user_avatars",
              });
              anh_dai_dien = uploadRes.secure_url;
            } catch (uploadError: any) {
              console.error("CLOUDINARY_UPLOAD_ERROR_IN_ROUTE", uploadError);
              const errMsg =
                uploadError &&
                typeof uploadError === "object" &&
                "message" in uploadError
                  ? (uploadError as any).message
                  : "Lỗi không xác định";
              throw new Error(`Không thể tải lên ảnh đại diện: ${errMsg}`);
            }
          }

          // ==========================================
          // GIAI ĐOẠN 4: Kích hoạt tài khoản (Lưu Database)
          // ==========================================
          sendProgress(4);
          await new Promise((r) => setTimeout(r, 450));

          const newUser = await prisma.nguoiDung.create({
            data: {
              ho_va_ten,
              email,
              so_dien_thoai,
              mat_khau_hash,
              vai_tro,
              trang_thai,
              ghi_chu,
              anh_dai_dien,
            },
            select: {
              ma_nguoi_dung: true,
              ho_va_ten: true,
              email: true,
              so_dien_thoai: true,
              vai_tro: true,
              trang_thai: true,
              ghi_chu: true,
              ngay_tao: true,
              anh_dai_dien: true,
            },
          });

          // Gửi phản hồi thành công cuối cùng
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "success",
                user: newUser,
                mat_khau_tam: matKhauTam,
              }) + "\n",
            ),
          );
          controller.close();
        } catch (err: any) {
          console.error("STREAM_CREATE_USER_ERROR", err);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                message: err.message || "Có lỗi xảy ra khi xử lý tạo tài khoản",
              }) + "\n",
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(customReadable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("CREATE_USER_ERROR_GLOBAL", error);
    return NextResponse.json(
      { message: "Lỗi server khi tạo tài khoản" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    if (session.user?.vai_tro !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền tạo tài khoản" },
        { status: 403 },
      );
    }
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword")?.trim() || "";
    const vai_tro = searchParams.get("vai_tro") as VaiTro | null;
    const trang_thai = searchParams.get(
      "trang_thai",
    ) as TrangThaiTaiKHoan | null;

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);

    const skip = (page - 1) * limit;

    const where: Prisma.NguoiDungWhereInput = {};

    if (keyword) {
      where.OR = [
        {
          ho_va_ten: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          so_dien_thoai: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ];
    }

    if (vai_tro && Object.values(VaiTro).includes(vai_tro)) {
      where.vai_tro = vai_tro;
    }

    if (trang_thai && Object.values(TrangThaiTaiKHoan).includes(trang_thai)) {
      where.trang_thai = trang_thai;
    }

    const [users, total] = await Promise.all([
      prisma.nguoiDung.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          ngay_tao: "desc",
        },
        select: {
          ma_nguoi_dung: true,
          ho_va_ten: true,
          email: true,
          so_dien_thoai: true,
          vai_tro: true,
          trang_thai: true,
          ghi_chu: true,
          ngay_tao: true,
          anh_dai_dien: true,

          _count: {
            select: {
              su_phan_cong: true,
              albums: true,
              phan_hoi: true,
            },
          },
        },
      }),

      prisma.nguoiDung.count({
        where,
      }),
    ]);

    return NextResponse.json(
      {
        message: "Lấy danh sách người dùng thành công",
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET_USERS_ERROR", error);

    return NextResponse.json(
      { message: "Lỗi server khi lấy danh sách người dùng" },
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

    if (session.user?.vai_tro !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền chỉnh sửa tài khoản" },
        { status: 403 },
      );
    }

    let ma_nguoi_dung = "";
    let ho_va_ten = "";
    let email = "";
    let so_dien_thoai: string | null = null;
    let vai_tro: VaiTro = VaiTro.THO_ANH;
    let trang_thai: TrangThaiTaiKHoan = TrangThaiTaiKHoan.HOAT_DONG;
    let ghi_chu = "";
    let matKhauInput = "";
    let avatarFile: File | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      ma_nguoi_dung = (formData.get("ma_nguoi_dung") as string) || "";
      ho_va_ten = (formData.get("name") as string)?.trim() || "";
      email = (formData.get("email") as string)?.trim().toLowerCase() || "";
      so_dien_thoai = (formData.get("telphone") as string)?.trim() || null;
      vai_tro = (formData.get("role") as VaiTro) || VaiTro.THO_ANH;
      trang_thai =
        (formData.get("stateAccount") as TrangThaiTaiKHoan) ||
        TrangThaiTaiKHoan.HOAT_DONG;
      ghi_chu = (formData.get("note") as string)?.trim() || "";
      matKhauInput = (formData.get("password") as string)?.trim() || "";
      avatarFile = formData.get("avatar") as File | null;
    } else {
      const body = await request.json();
      ma_nguoi_dung = body.ma_nguoi_dung || "";
      ho_va_ten = body.ho_va_ten?.trim() || "";
      email = body.email?.trim().toLowerCase() || "";
      so_dien_thoai = body.so_dien_thoai?.trim() || null;
      vai_tro = body.vai_tro || VaiTro.THO_ANH;
      trang_thai = body.trang_thai || TrangThaiTaiKHoan.HOAT_DONG;
      ghi_chu = body.ghi_chu?.trim() || "";
      matKhauInput = body.mat_khau?.trim() || "";
    }

    if (!ma_nguoi_dung) {
      return NextResponse.json(
        { message: "Mã người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // Verify fields
    if (!ho_va_ten) return NextResponse.json({ message: "Vui lòng nhập họ và tên" }, { status: 400 });
    if (!email) return NextResponse.json({ message: "Vui lòng nhập email" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ message: "Email không hợp lệ" }, { status: 400 });

    // Check email uniqueness
    const existingUser = await prisma.nguoiDung.findFirst({
      where: {
        email,
        NOT: {
          ma_nguoi_dung
        }
      }
    });
    if (existingUser) {
      return NextResponse.json({ message: "Email đã được sử dụng bởi tài khoản khác" }, { status: 400 });
    }

    const updateData: any = {
      ho_va_ten,
      email,
      so_dien_thoai,
      vai_tro,
      trang_thai,
      ghi_chu,
    };

    if (matKhauInput && matKhauInput.trim().length >= 6) {
      updateData.mat_khau_hash = await bcrypt.hash(matKhauInput.trim(), 10);
    }

    // Handle avatar upload if provided
    if (avatarFile && avatarFile.size > 0) {
      try {
        const arrayBuffer = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = avatarFile.type;
        const base64Data = buffer.toString("base64");
        const fileUri = `data:${mimeType};base64,${base64Data}`;

        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "user_avatars",
        });
        updateData.anh_dai_dien = uploadRes.secure_url;
      } catch (uploadError: any) {
        console.error("CLOUDINARY_UPLOAD_ERROR_PATCH", uploadError);
        return NextResponse.json(
          { message: `Không thể tải lên ảnh đại diện: ${uploadError.message || "Lỗi upload"}` },
          { status: 500 }
        );
      }
    }

    const updatedUser = await prisma.nguoiDung.update({
      where: { ma_nguoi_dung },
      data: updateData,
      select: {
        ma_nguoi_dung: true,
        ho_va_ten: true,
        email: true,
        so_dien_thoai: true,
        vai_tro: true,
        trang_thai: true,
        ghi_chu: true,
        anh_dai_dien: true,
      }
    });

    return NextResponse.json(
      { message: "Cập nhật tài khoản thành công", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH_USER_ERROR", error);
    return NextResponse.json(
      { message: "Lỗi server khi cập nhật tài khoản" },
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

    if (session.user?.vai_tro !== "ADMIN") {
      return NextResponse.json(
        { message: "Bạn không có quyền xóa tài khoản" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Mã người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // Prevent deleting self
    if (session.user?.ma_nguoi_dung === id) {
      return NextResponse.json(
        { message: "Bạn không thể tự xóa tài khoản của chính mình" },
        { status: 400 },
      );
    }

    await prisma.nguoiDung.delete({
      where: { ma_nguoi_dung: id }
    });

    return NextResponse.json(
      { message: "Xóa tài khoản thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_USER_ERROR", error);
    return NextResponse.json(
      { message: "Lỗi server khi xóa tài khoản" },
      { status: 500 },
    );
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";

  let password = "Nf@";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
