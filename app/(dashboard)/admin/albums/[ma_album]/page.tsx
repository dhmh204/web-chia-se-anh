import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AlbumDetail from "./AlbumDetail";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ ma_album: string }>;
};

const AdminAlbumDetailPage = async ({ params }: PageProps) => {
  const { ma_album } = await params;

  if (!ma_album) {
    return notFound();
  }

  // Fetch album details, associated project info, and all photos
  const album = await prisma.album.findUnique({
    where: { ma_album },
    include: {
      du_an: {
        select: {
          ma_du_an: true,
          ten_du_an: true,
          mat_khau: true,
          trang_thai: true,
        },
      },
      hinh_anh: {
        orderBy: {
          ngay_tao: "desc",
        },
        include: {
          phan_hoi: {
            orderBy: {
              ngay_tao: "asc",
            },
            select: {
              ma_phan_hoi: true,
              phan_hoi: true,
              nguoi_binh_luan: true,
              ngay_tao: true,
              trang_thai: true,
              toa_do_X: true,
              toa_do_Y: true,
              phan_tram_chieu_rong: true,
              phan_tram_chieu_cao: true,
              ma_tho_anh: true,
              tho_anh: {
                select: {
                  ho_va_ten: true,
                  vai_tro: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!album) {
    return notFound();
  }

  // Calculate statistics for this album
  const totalPhotosCount = album.hinh_anh.length;

  const totalFeedbackCount = album.hinh_anh.reduce(
    (acc, photo) => acc + photo.phan_hoi.length,
    0,
  );

  const pendingFeedbackCount = album.hinh_anh.reduce(
    (acc, photo) =>
      acc + photo.phan_hoi.filter((f) => f.trang_thai === "CHUA_XU_LY").length,
    0,
  );

  // Serialize properties to prevent Date and Decimal next payload warnings
  const serializedAlbum = {
    ma_album: album.ma_album,
    ten_alb: album.ten_alb,
    loai_alb: album.loai_alb,
    quyen_download: album.quyen_download,
    ngay_tao: album.ngay_tao.toISOString(),
    du_an: {
      ma_du_an: album.du_an.ma_du_an,
      ten_du_an: album.du_an.ten_du_an,
      mat_khau: album.du_an.mat_khau || "",
      trang_thai: album.du_an.trang_thai,
    },
    hinh_anh: album.hinh_anh.map((photo) => ({
      ma_hinh_anh: photo.ma_hinh_anh,
      url_anh: photo.url_anh,
      bi_mo: photo.bi_mo,
      yeu_thich: photo.yeu_thich,
      ngay_tao: photo.ngay_tao.toISOString(),
      album: {
        ten_alb: album.ten_alb,
        loai_alb: album.loai_alb,
        du_an: {
          ten_du_an: album.du_an.ten_du_an,
          trang_thai: album.du_an.trang_thai,
        },
      },
      phan_hoi: photo.phan_hoi.map((f) => ({
        ma_phan_hoi: f.ma_phan_hoi,
        phan_hoi: f.phan_hoi,
        nguoi_binh_luan: f.nguoi_binh_luan,
        ngay_tao: f.ngay_tao.toISOString(),
        trang_thai: f.trang_thai,
        toa_do_X: Number(f.toa_do_X),
        toa_do_Y: Number(f.toa_do_Y),
        phan_tram_chieu_rong: Number(f.phan_tram_chieu_rong),
        phan_tram_chieu_cao: Number(f.phan_tram_chieu_cao),
        ma_tho_anh: f.ma_tho_anh,
        tho_anh: f.tho_anh,
      })),
    })),
  };

  const stats = {
    totalPhotos: totalPhotosCount,
    totalFeedback: totalFeedbackCount,
    pendingFeedback: pendingFeedbackCount,
  };

  return <AlbumDetail album={serializedAlbum as any} stats={stats} />;
};

export default AdminAlbumDetailPage;
