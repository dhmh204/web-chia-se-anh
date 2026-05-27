import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AlbumDetailClient from "@/app/(customer)/album/[ma_album]/components/AlbumDetailClient";

export const revalidate = 0;

type PageProps = {
  params: Promise<{
    ma_du_an: string;
  }>;
};

const PhotographerDetailAlbum = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { ma_du_an } = await params;

  if (!ma_du_an) {
    return notFound();
  }

  const project = await prisma.du_an.findUnique({
    where: {
      ma_du_an,
    },
    include: {
      su_phan_cong: true,

      album: {
        orderBy: {
          ngay_tao: "desc",
        },
        include: {
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
      },
    },
  });

  if (!project) {
    return notFound();
  }

  const isAdmin = session.user.vai_tro === "ADMIN";

  const isAssigned = project.su_phan_cong.some(
    (item) => item.ma_nguoi_dung === session.user.ma_nguoi_dung
  );

  if (!isAdmin && !isAssigned) {
    redirect("/login");
  }

  const albums = project.album;

  if (albums.length === 0) {
    return notFound();
  }

  const allPhotos = albums.flatMap((album) =>
    album.hinh_anh.map((photo) => ({
      ...photo,
      album,
    }))
  );

  const allFaces = albums.flatMap((album) => album.khuon_mat);

  const totalPhotosCount = allPhotos.length;

  const totalFavoritesCount = allPhotos.filter(
    (photo) => photo.yeu_thich
  ).length;

  const totalFeedbackCount = allPhotos.reduce(
    (acc, photo) => acc + photo.phan_hoi.length,
    0
  );

  const stats = {
    totalPhotos: totalPhotosCount,
    totalFavorites: totalFavoritesCount,
    totalFeedback: totalFeedbackCount,
  };

  const firstAlbum = albums[0];

  const serializedAlbum = {
    ma_album: firstAlbum.ma_album,
    ten_alb: `Tất cả album - ${project.ten_du_an}`,
    loai_alb: firstAlbum.loai_alb,
    quyen_download: firstAlbum.quyen_download,

    du_an: {
      ma_du_an: project.ma_du_an,
      ten_du_an: project.ten_du_an,
    },

    hinh_anh: allPhotos.map((photo) => ({
      ma_hinh_anh: photo.ma_hinh_anh,
      ma_album: photo.ma_album,
      url_anh: photo.url_anh,
      bi_mo: photo.bi_mo,
      yeu_thich: photo.yeu_thich,
      ngay_tao: photo.ngay_tao.toISOString(),

      album: {
        ten_alb: photo.album.ten_alb,
        loai_alb: photo.album.loai_alb,
        du_an: {
          ten_du_an: project.ten_du_an,
          trang_thai: project.trang_thai,
        },
      },

      phan_hoi: photo.phan_hoi.map((feedback) => ({
        ma_phan_hoi: feedback.ma_phan_hoi,
        phan_hoi: feedback.phan_hoi,
        nguoi_binh_luan: feedback.nguoi_binh_luan,
        ngay_tao: feedback.ngay_tao.toISOString(),
        trang_thai: feedback.trang_thai,

        toa_do_X: Number(feedback.toa_do_X),
        toa_do_Y: Number(feedback.toa_do_Y),
        phan_tram_chieu_rong: Number(feedback.phan_tram_chieu_rong),
        phan_tram_chieu_cao: Number(feedback.phan_tram_chieu_cao),

        ma_tho_anh: feedback.ma_tho_anh,
        tho_anh: feedback.tho_anh,
      })),
    })),

    khuon_mat: allFaces.map((face) => ({
      ma_nhom: face.ma_nhom,
      ten_nhan_vat: face.ten_nhan_vat,
      anh_dai_dien: face.anh_dai_dien,
      photoIds: face.khuon_mat_trong_anh.map((item) => item.ma_hinh_anh),
    })),
  };

  return <AlbumDetailClient album={serializedAlbum as any} stats={stats} />;
};

export default PhotographerDetailAlbum;