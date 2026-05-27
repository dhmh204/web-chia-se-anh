import React from "react";
import { prisma } from "@/lib/prisma";
import PhotosClient from "../../admin/photos/components/PhotosClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

const PhotographerFavoritesPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  // 1. Fetch photographer's projects
  const projects = await prisma.duan.findMany({
    where: {
      su_phan_cong: {
        some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
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

  // 2. Fetch photographer's albums
  const albums = await prisma.album.findMany({
    where: {
      du_an: {
        su_phan_cong: {
          some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
        },
      },
    },
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

  // 3. Fetch photographer's photos (can fetch all, but pre-filter to only favorites or just let PhotosClient show them)
  // Let's fetch all photos and pre-select the favorites tab so they can see all options but start on favorites!
  const photos = await prisma.hinhAnh.findMany({
    where: {
      album: {
        du_an: {
          su_phan_cong: {
            some: { ma_nguoi_dung: session.user.ma_nguoi_dung },
          },
        },
      },
    },
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
          toa_do_X: true,
          toa_do_Y: true,
          phan_tram_chieu_rong: true,
          phan_tram_chieu_cao: true,
          ma_tho_anh: true,
          trang_thai: true,
          tho_anh: {
            select: {
              ho_va_ten: true,
              vai_tro: true,
            },
          },
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
      toa_do_X: Number(f.toa_do_X),
      toa_do_Y: Number(f.toa_do_Y),
      phan_tram_chieu_rong: Number(f.phan_tram_chieu_rong),
      phan_tram_chieu_cao: Number(f.phan_tram_chieu_cao),
      ma_tho_anh: f.ma_tho_anh,
      trang_thai: f.trang_thai,
      tho_anh: f.tho_anh,
    })),
  }));

  return (
    <PhotosClient
      initialPhotos={photosData}
      projects={projects}
      albums={albums as any}
      initialTab="favorites"
    />
  );
};

export default PhotographerFavoritesPage;
