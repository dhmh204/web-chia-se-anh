import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import AlbumDetailClient from "./components/AlbumDetailClient";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ ma_album: string }>;
};

export default async function CustomerAlbumDetailPage({ params }: PageProps) {
  const { ma_album } = await params;

  if (!ma_album) {
    return notFound();
  }

  // Fetch album with associated project, images, feedback, and face groupings
  const album = await prisma.album.findUnique({
    where: { ma_album },
    include: {
      du_an: {
        select: {
          ma_du_an: true,
          ten_du_an: true,
          mat_khau: true,
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
            },
          },
        },
      },
      khuon_mat: {
        include: {
          khuon_mat_trong_anh: {
            select: {
              ma_hinh_anh: true,
            },
          },
        },
      },
    },
  });

  if (!album) {
    return notFound();
  }

  const project = album.du_an;
  const hasPassword = project.mat_khau !== null && project.mat_khau.trim() !== "";

  // Server-side check for password protection of the parent project
  if (hasPassword) {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get(`project_unlocked_${project.ma_du_an}`)?.value === "true";
    if (!unlocked) {
      redirect(`/projects/${project.ma_du_an}/access`);
    }
  }

  // Calculate statistics
  const totalPhotosCount = album.hinh_anh.length;
  const totalFavoritesCount = album.hinh_anh.filter((p) => p.yeu_thich).length;
  const totalFeedbackCount = album.hinh_anh.reduce(
    (acc, photo) => acc + photo.phan_hoi.length,
    0
  );

  const stats = {
    totalPhotos: totalPhotosCount,
    totalFavorites: totalFavoritesCount,
    totalFeedback: totalFeedbackCount,
  };

  // Serialize properties to prevent Date and Decimal warnings in Next.js Client payload
  const serializedAlbum = {
    ma_album: album.ma_album,
    ten_alb: album.ten_alb,
    loai_alb: album.loai_alb,
    quyen_download: album.quyen_download,
    du_an: {
      ma_du_an: project.ma_du_an,
      ten_du_an: project.ten_du_an,
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
          ten_du_an: project.ten_du_an,
          trang_thai: "MOI" as any,
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
      })),
    })),
    khuon_mat: album.khuon_mat.map((face) => ({
      ma_nhom: face.ma_nhom,
      ten_nhan_vat: face.ten_nhan_vat,
      anh_dai_dien: face.anh_dai_dien,
      photoIds: face.khuon_mat_trong_anh.map((k) => k.ma_hinh_anh),
    })),
  };

  return <AlbumDetailClient album={serializedAlbum as any} stats={stats} />;
}
