import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectDetailClient from "@/app/(dashboard)/admin/projects/[ma_du_an]/components/ProjectDetailClient";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ ma_du_an: string }>;
};

const AdminProjectDetailPage = async ({ params }: PageProps) => {
  const { ma_du_an } = await params;

  if (!ma_du_an) {
    return notFound();
  }

  // Fetch project details, customer info, photographer assignments, and albums list
  const project = await prisma.duan.findUnique({
    where: { ma_du_an },
    include: {
      khach_hang: true,
      su_phan_cong: {
        include: {
          nguoi_dung: {
            select: {
              ma_nguoi_dung: true,
              ho_va_ten: true,
            },
          },
        },
      },
      albums: {
        orderBy: {
          ngay_tao: "desc",
        },
        include: {
          _count: {
            select: {
              hinh_anh: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  // Fetch photographers list for the assignment dropdown/multi-select
  const photographers = await prisma.nguoiDung.findMany({
    where: {
      vai_tro: "THO_ANH",
      trang_thai: "HOAT_DONG",
    },
    select: {
      ma_nguoi_dung: true,
      ho_va_ten: true,
    },
  });

  // Calculate project statistics
  const albumIds = project.albums.map((a) => a.ma_album);
  const totalPhotosCount = await prisma.hinhAnh.count({
    where: {
      ma_album: { in: albumIds },
    },
  });

  const totalFeedbackCount = await prisma.phanHoi.count({
    where: {
      hinh_anh: {
        ma_album: { in: albumIds },
      },
    },
  });

  const pendingFeedbackCount = await prisma.phanHoi.count({
    where: {
      trang_thai: "CHUA_XU_LY",
      hinh_anh: {
        ma_album: { in: albumIds },
      },
    },
  });

  // Serialize properties to prevent Date and Decimal next payload warnings
  const serializedProject = {
    ma_du_an: project.ma_du_an,
    ten_du_an: project.ten_du_an,
    ngay_chup: project.ngay_chup.toISOString(),
    link_anh_bia: project.link_anh_bia,
    mat_khau: project.mat_khau,
    trang_thai: project.trang_thai,
    ghi_chu: project.ghi_chu || "",
    khach_hang: project.khach_hang
      ? {
        ma_khach_hang: project.khach_hang.ma_khach_hang,
        ho_va_ten: project.khach_hang.ho_va_ten,
        so_dien_thoai: project.khach_hang.so_dien_thoai,
      }
      : null,
    su_phan_cong: project.su_phan_cong.map((spc) => ({
      ma_nguoi_dung: spc.nguoi_dung.ma_nguoi_dung,
      ho_va_ten: spc.nguoi_dung.ho_va_ten,
    })),
    albums: project.albums.map((album) => ({
      ma_album: album.ma_album,
      ten_alb: album.ten_alb,
      loai_alb: album.loai_alb,
      quyen_download: album.quyen_download,
      photoCount: album._count.hinh_anh,
      ngay_tao: album.ngay_tao.toISOString(),
    })),
  };

  const photographersList = photographers.map((p) => ({
    name: p.ma_nguoi_dung,
    value: p.ho_va_ten,
  }));

  const stats = {
    totalPhotos: totalPhotosCount,
    totalFeedback: totalFeedbackCount,
    pendingFeedback: pendingFeedbackCount,
  };

  return (
    <ProjectDetailClient
      project={serializedProject}
      photographers={photographersList}
      stats={stats}
      role="photographer"
    />
  );
};

export default AdminProjectDetailPage;
