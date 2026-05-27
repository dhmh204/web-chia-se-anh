import React from 'react';
import AssignedProjects from '../components/AssignedProjects';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const revalidate = 0;

const PhotographerProjects = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // Fetch all assigned projects
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
  });

  const serializedProjects = assignedProjects.map((p) => {
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
      <AssignedProjects isDetails projects={serializedProjects} />  
    </div>
  );
};

export default PhotographerProjects;
