import React from "react";
import { prisma } from "@/lib/prisma";
import AiClient from "./components/AiClient";

export const metadata = {
  title: "AI / Nhãn khuôn mặt",
};

export default async function AiPage() {
  // Fetch albums with project details and photo count
  const albums = await prisma.album.findMany({
    orderBy: {
      ngay_tao: "desc",
    },
    select: {
      ma_album: true,
      ten_alb: true,
      du_an: {
        select: {
          ten_du_an: true,
        },
      },
      _count: {
        select: {
          hinh_anh: true,
        },
      },
    },
  });

  const formattedAlbums = albums.map((a) => ({
    ma_album: a.ma_album,
    ten_alb: a.ten_alb,
    ten_du_an: a.du_an.ten_du_an,
    photosCount: a._count.hinh_anh,
  }));

  return <AiClient initialAlbums={formattedAlbums} />;
}
