import React from "react";
import { prisma } from "@/lib/prisma";
import PhotosClient from "./components/PhotosClient";

export const revalidate = 0;

const PhotoPage = async () => {
  const projects = await prisma.duan.findMany({
    orderBy: {
      ten_du_an: "asc",
    },
    select: {
      ma_du_an: true,
      ten_du_an: true,
    },
  });

  const albums = await prisma.album.findMany({
    orderBy: {
      ten_alb: "asc",
    },
    select: {
      ma_album: true,
      ten_alb: true,
      ma_du_an: true,
      loai_alb: true,
    },
  });

  const photos = await prisma.hinhAnh.findMany({
    orderBy: {
      ngay_tao: "desc",
    },
    include: {
      album: {
        select: {
          ten_alb: true,
          loai_alb: true,
          du_an: {
            select: {
              ten_du_an: true,
              trang_thai: true,
            },
          },
        },
      },
      phan_hoi: {
        orderBy: {
          ngay_tao: "asc",
        },
        select: {
          ma_phan_hoi: true,
          phan_hoi: true,
          nguoi_binh_luan: true,
          ngay_tao: true,
        },
      },
    },
  });

  const photosData = photos.map((p) => ({
    ma_hinh_anh: p.ma_hinh_anh,
    ma_album: p.ma_album,
    url_anh: p.url_anh,
    bi_mo: p.bi_mo,
    yeu_thich: p.yeu_thich,
    ngay_tao: p.ngay_tao.toISOString(),
    album: {
      ten_alb: p.album.ten_alb,
      loai_alb: p.album.loai_alb,
      du_an: {
        ten_du_an: p.album.du_an.ten_du_an,
        trang_thai: p.album.du_an.trang_thai,
      },
    },
    phan_hoi: p.phan_hoi.map((f) => ({
      ma_phan_hoi: f.ma_phan_hoi,
      phan_hoi: f.phan_hoi,
      nguoi_binh_luan: f.nguoi_binh_luan,
      ngay_tao: f.ngay_tao.toISOString(),
    })),
  }));

  return (
    <PhotosClient
      initialPhotos={photosData}
      projects={projects}
      albums={albums as any}
    />
  );
};

export default PhotoPage;
