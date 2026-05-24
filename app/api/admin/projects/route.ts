import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

// Generate unique share code for the project
async function generateUniqueShareCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";

  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await prisma.duan.findUnique({
      where: { ma_chia_se: code },
    });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập" },
        { status: 401 },
      );
    }

    // Retrieve form data
    const formData = await request.formData();
    const nameProject = (formData.get("nameProject") as string)?.trim();
    const dateStr = formData.get("date") as string;
    const telPhone = (formData.get("telPhone") as string)?.trim();
    const nameCustomer = (formData.get("nameCustomer") as string)?.trim();
    const photographerIds = formData.getAll("photographer") as string[];
    const activePhotographerIds = photographerIds.filter(
      (id) => id.trim() !== "",
    );
    const coverImageFile = formData.get("link_anh_bia") as File | null;
    const mat_khau = (formData.get("mat_khau") as string)?.trim() || null;
    const trang_thai = (formData.get("trang_thai") as string)?.trim() || "MOI";

    // Validation
    if (!nameProject) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên dự án" },
        { status: 400 },
      );
    }
    if (!dateStr) {
      return NextResponse.json(
        { message: "Vui lòng chọn ngày chụp" },
        { status: 400 },
      );
    }
    if (!telPhone) {
      return NextResponse.json(
        { message: "Vui lòng nhập số điện thoại khách hàng" },
        { status: 400 },
      );
    }
    if (!nameCustomer) {
      return NextResponse.json(
        { message: "Vui lòng nhập tên khách hàng" },
        { status: 400 },
      );
    }
    if (activePhotographerIds.length === 0) {
      return NextResponse.json(
        { message: "Vui lòng chọn thợ ảnh phụ trách" },
        { status: 400 },
      );
    }
    let shootingDate: Date;
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JS Date
        const year = parseInt(parts[2], 10);
        shootingDate = new Date(year, month, day);
      } else {
        shootingDate = new Date(dateStr);
      }
    } else {
      shootingDate = new Date(dateStr);
    }

    if (isNaN(shootingDate.getTime())) {
      return NextResponse.json(
        { message: "Ngày chụp không hợp lệ" },
        { status: 400 },
      );
    }

    // 1. Handle Customer logic
    let customerId = "";
    const existingCustomer = await prisma.khachHang.findUnique({
      where: { so_dien_thoai: telPhone },
    });

    if (existingCustomer) {
      customerId = existingCustomer.ma_khach_hang;
      // If customer name was modified, update it in the database
      if (existingCustomer.ho_va_ten !== nameCustomer) {
        await prisma.khachHang.update({
          where: { ma_khach_hang: customerId },
          data: { ho_va_ten: nameCustomer },
        });
      }
    } else {
      // Create new customer
      const newCustomer = await prisma.khachHang.create({
        data: {
          so_dien_thoai: telPhone,
          ho_va_ten: nameCustomer,
        },
      });
      customerId = newCustomer.ma_khach_hang;
    }

    // 2. Handle Cloudinary upload if file exists and has size > 0
    let link_anh_bia = "/images/example.jpg"; // Fallback/Default image
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const arrayBuffer = await coverImageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = coverImageFile.type;
        const base64Data = buffer.toString("base64");
        const fileUri = `data:${mimeType};base64,${base64Data}`;

        const uploadRes = await cloudinary.uploader.upload(fileUri, {
          folder: "project_covers",
        });
        link_anh_bia = uploadRes.secure_url;
      } catch (uploadError: any) {
        console.error("CLOUDINARY_PROJECT_UPLOAD_ERROR", uploadError);
        return NextResponse.json(
          {
            message: `Không thể tải lên ảnh bìa: ${uploadError.message || "Lỗi Cloudinary"}`,
          },
          { status: 500 },
        );
      }
    }

    // 3. Generate unique share code
    const ma_chia_se = await generateUniqueShareCode();

    // 4. Create Project (Duan)
    const validStatuses = ["MOI", "DANG_CHON", "DANG_SUA", "HOAN_THANH"];
    const status = validStatuses.includes(trang_thai)
      ? (trang_thai as any)
      : "MOI";

    const newProject = await prisma.duan.create({
      data: {
        ten_du_an: nameProject,
        ngay_chup: shootingDate,
        ma_chia_se,
        link_anh_bia,
        nguoi_tao: session.user.ma_nguoi_dung as string, // Admin / creator ID
        ma_khach_hang: customerId,
        mat_khau,
        trang_thai: status,
      },
    });

    // 5. Create assignment for the photographers (SuPhanCong)
    await prisma.suPhanCong.createMany({
      data: activePhotographerIds.map((pId) => ({
        ma_nguoi_dung: pId,
        ma_du_an: newProject.ma_du_an,
      })),
    });

    return NextResponse.json(
      {
        message: "Tạo dự án mới thành công",
        project: newProject,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("CREATE_PROJECT_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi tạo dự án" },
      { status: 500 },
    );
  }
}

// PATCH handler to update project details
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
    const {
      ma_du_an,
      ten_du_an,
      ngay_chup,
      telPhone,
      nameCustomer,
      photographerIds,
      mat_khau,
      trang_thai,
      ghi_chu,
    } = body;

    if (!ma_du_an) {
      return NextResponse.json(
        { message: "Mã dự án là bắt buộc để cập nhật" },
        { status: 400 },
      );
    }

    // 1. Verify project exists
    const project = await prisma.duan.findUnique({
      where: { ma_du_an },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Dự án không tồn tại" },
        { status: 404 },
      );
    }

    const updateData: any = {};
    if (ten_du_an !== undefined) updateData.ten_du_an = ten_du_an.trim();
    if (mat_khau !== undefined) updateData.mat_khau = mat_khau?.trim() || null;
    if (trang_thai !== undefined) updateData.trang_thai = trang_thai;
    if (ghi_chu !== undefined) updateData.ghi_chu = ghi_chu.trim();

    if (ngay_chup !== undefined) {
      const shootingDate = new Date(ngay_chup);
      if (isNaN(shootingDate.getTime())) {
        return NextResponse.json(
          { message: "Ngày chụp không hợp lệ" },
          { status: 400 },
        );
      }
      updateData.ngay_chup = shootingDate;
    }

    // 2. Handle Customer updates if phone and name are provided
    if (telPhone !== undefined && nameCustomer !== undefined) {
      let customerId = project.ma_khach_hang;
      const cleanPhone = telPhone.trim();

      if (cleanPhone) {
        const existingCustomer = await prisma.khachHang.findUnique({
          where: { so_dien_thoai: cleanPhone },
        });

        if (existingCustomer) {
          customerId = existingCustomer.ma_khach_hang;
          if (existingCustomer.ho_va_ten !== nameCustomer.trim()) {
            await prisma.khachHang.update({
              where: { ma_khach_hang: customerId },
              data: { ho_va_ten: nameCustomer.trim() },
            });
          }
        } else {
          const newCustomer = await prisma.khachHang.create({
            data: {
              so_dien_thoai: cleanPhone,
              ho_va_ten: nameCustomer.trim(),
            },
          });
          customerId = newCustomer.ma_khach_hang;
        }
      } else {
        customerId = null;
      }
      updateData.ma_khach_hang = customerId;
    }

    // 3. Update the Project
    const updatedProject = await prisma.duan.update({
      where: { ma_du_an },
      data: updateData,
    });

    // 4. Update Photographers assignments if provided
    if (photographerIds !== undefined) {
      // Clear old assignments
      await prisma.suPhanCong.deleteMany({
        where: { ma_du_an },
      });

      // Add new assignments
      const activeIds = photographerIds.filter(
        (id: string) => id.trim() !== "",
      );
      if (activeIds.length > 0) {
        await prisma.suPhanCong.createMany({
          data: activeIds.map((pId: string) => ({
            ma_nguoi_dung: pId,
            ma_du_an,
          })),
        });
      }
    }

    return NextResponse.json({
      message: "Cập nhật dự án thành công",
      project: updatedProject,
    });
  } catch (error: any) {
    console.error("UPDATE_PROJECT_ERROR", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi cập nhật dự án" },
      { status: 500 },
    );
  }
}
