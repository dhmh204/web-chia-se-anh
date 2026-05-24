import React from "react";
import CreateAlbum from "./components/CreateAlbum";
import { prisma } from "@/lib/prisma";
import RecentlyAlbum from "./components/RecentlyAlbum";

const AlbumsPage = async () => {
  const projects = await prisma.duan.findMany({
    orderBy: {
      ten_du_an: "asc",
    },
    select: {
      ma_du_an: true,
      ten_du_an: true,
    },
  });

  const projectOptions = projects.map((p) => ({
    value: p.ten_du_an,
    name: p.ma_du_an,
  }));

  // Fetch albums from database
  const albums = await prisma.album.findMany({
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
      <CreateAlbum projects={projectOptions} />
      <RecentlyAlbum albums={albums as any} />
    </div>
  );
};

export default AlbumsPage;
