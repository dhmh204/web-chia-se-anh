import React from "react";
import CreateAlbum from "../../admin/albums/components/CreateAlbum";
import RecentlyAlbum from "../../admin/albums/components/RecentlyAlbum";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ ma_du_an?: string }>;
};

const PhotographerAlbumsPage = async ({ searchParams }: PageProps) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const { ma_du_an } = await searchParams;

  // 1. Fetch photographer's assigned projects for dropdown selection
  const assignedProjects = await prisma.duan.findMany({
    where: {
      su_phan_cong: {
        some: {
          ma_nguoi_dung: session.user.ma_nguoi_dung,
        },
      },
    },
    orderBy: {
      ten_du_an: "asc",
    },
    select: {
      ma_du_an: true,
      ten_du_an: true,
    },
  });

  const projectOptions = assignedProjects.map((p) => ({
    value: p.ten_du_an,
    name: p.ma_du_an,
  }));

  // 2. Fetch photographer's albums (scoped to photographer's projects)
  const whereClause: any = {
    du_an: {
      su_phan_cong: {
        some: {
          ma_nguoi_dung: session.user.ma_nguoi_dung,
        },
      },
    },
  };

  if (ma_du_an) {
    whereClause.ma_du_an = ma_du_an;
  }

  const albums = await prisma.album.findMany({
    where: whereClause,
    orderBy: {
      ngay_tao: "desc",
    },
    select: {
      ma_album: true,
      ten_alb: true,
      loai_alb: true,
      quyen_download: true,
      du_an: {
        select: {
          ten_du_an: true,
          mat_khau: true,
          link_anh_bia: true,
        },
      },
      hinh_anh: {
        take: 1,
        select: {
          url_anh: true,
        },
      },
      _count: {
        select: {
          hinh_anh: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <CreateAlbum projects={projectOptions} role="photographer" />
      <RecentlyAlbum albums={albums as any} role="photographer" />
    </div>
  );
};

export default PhotographerAlbumsPage;
