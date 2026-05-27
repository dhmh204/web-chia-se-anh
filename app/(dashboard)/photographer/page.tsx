import React from 'react';
import StartCardList from '../components/StartCardList';
import DashboardGrid from '../admin/components/DashboardGrid';
import AssignedProjects from './components/AssignedProjects';
import QuickActionsCard from './components/QuickActionsCard';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const revalidate = 0;

const classCssCommon =
  "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]";

const PhotographerPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch photographer stats
  const [
    assignedProjectsCount,
    openAlbumsCount,
    favoritePhotosCount,
    pendingFeedbacksCount,
    recentProjects,
  ] = await Promise.all([
    prisma.duan.count({
      where: {
        su_phan_cong: {
          some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
        },
      },
    }),
    prisma.album.count({
      where: {
        du_an: {
          su_phan_cong: {
            some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
          },
        },
      },
    }),
    prisma.hinhAnh.count({
      where: {
        yeu_thich: true,
        album: {
          du_an: {
            su_phan_cong: {
              some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
            },
          },
        },
      },
    }),
    prisma.phanHoi.count({
      where: {
        trang_thai: "CHUA_XU_LY",
        hinh_anh: {
          album: {
            du_an: {
              su_phan_cong: {
                some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
              },
            },
          },
        },
      },
    }),
    prisma.duan.findMany({
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
      take: 5,
      include: {
        khach_hang: true,
        albums: {
          include: {
            _count: {
              select: {
                hinh_anh: true,
              },
            },
            hinh_anh: {
              include: {
                _count: {
                  select: {
                    phan_hoi: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  const photographerList = [
    {
      label: "Dự án được giao",
      value: assignedProjectsCount,
      description: `Dự án đang xử lý`,
    },
    {
      label: "Album đang mở",
      value: openAlbumsCount,
      description: "Đang chia sẻ cho khách",
    },
    {
      label: "Ảnh khách yêu thích",
      value: favoritePhotosCount,
      description: "Từ ảnh yêu thích/phản hồi",
    },
    {
      label: "Phản hồi mới",
      value: pendingFeedbacksCount,
      description: "Cần kiểm tra",
    },
  ];

  const serializedProjects = recentProjects.map((p) => {
    const albumsCount = p.albums.length;
    const photosCount = p.albums.reduce((sum, alb) => sum + alb._count.hinh_anh, 0);
    const feedbacksCount = p.albums.reduce((sum, alb) => {
      return sum + alb.hinh_anh.reduce((fSum, img) => fSum + img._count.phan_hoi, 0);
    }, 0);
    return {
      ma_du_an: p.ma_du_an,
      ten_du_an: p.ten_du_an,
      trang_thai: p.trang_thai,
      ngay_chup: p.ngay_chup.toISOString(),
      ghi_chu: p.ghi_chu || "",
      mat_khau: p.mat_khau,
      ma_chia_se: p.ma_chia_se,
      khach_hang: p.khach_hang ? {
        ho_va_ten: p.khach_hang.ho_va_ten,
        so_dien_thoai: p.khach_hang.so_dien_thoai,
      } : null,
      albumsCount,
      photosCount,
      feedbacksCount,
    };
  });

  return (
    <div>
      <StartCardList data={photographerList} classCssCommon={classCssCommon} />
      <DashboardGrid>
        <AssignedProjects projects={serializedProjects} />
        <QuickActionsCard />
      </DashboardGrid>
    </div>
  );
};

export default PhotographerPage;
