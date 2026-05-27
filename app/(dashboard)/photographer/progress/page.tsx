import React from "react";
import { prisma } from "@/lib/prisma";
import ProgressClient from "./components/ProgressClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

const PhotographerProgressPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch all projects assigned to the photographer with counts
  const assignedProjects = await prisma.duan.findMany({
    where: {
      su_phan_cong: {
        some: {
          ma_nguoi_dung: session.user.ma_nguoi_dung,
        },
      },
    },
    orderBy: {
      ngay_chup: "desc",
    },
    include: {
      khach_hang: true,
      albums: {
        include: {
          hinh_anh: {
            include: {
              phan_hoi: true,
            },
          },
        },
      },
    },
  });

  const serializedProjects = assignedProjects.map((p) => {
    let originalPhotosCount = 0;
    let finalPhotosCount = 0;
    let favoritesCount = 0;
    let totalFeedbackCount = 0;
    let resolvedFeedbackCount = 0;

    p.albums.forEach((alb) => {
      if (alb.loai_alb === "ANH_GOC") {
        originalPhotosCount += alb.hinh_anh.length;
      } else {
        finalPhotosCount += alb.hinh_anh.length;
      }

      alb.hinh_anh.forEach((img) => {
        if (img.yeu_thich) {
          favoritesCount++;
        }
        totalFeedbackCount += img.phan_hoi.length;
        resolvedFeedbackCount += img.phan_hoi.filter((f) => f.trang_thai === "DA_XU_LY").length;
      });
    });

    return {
      ma_du_an: p.ma_du_an,
      ten_du_an: p.ten_du_an,
      trang_thai: p.trang_thai,
      ngay_chup: p.ngay_chup.toISOString(),
      khach_hang: p.khach_hang ? {
        ho_va_ten: p.khach_hang.ho_va_ten,
        so_dien_thoai: p.khach_hang.so_dien_thoai,
      } : null,
      originalPhotosCount,
      finalPhotosCount,
      favoritesCount,
      totalFeedbackCount,
      resolvedFeedbackCount,
    };
  });

  return <ProgressClient projects={serializedProjects} />;
};

export default PhotographerProgressPage;
