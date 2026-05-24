import React from "react";
import { prisma } from "@/lib/prisma";
import FeedbacksClient from "./components/FeedbacksClient";

export const revalidate = 0;

export default async function FeedbacksPage() {
  // 1. Fetch guest comments (flat list, where ma_tho_anh is null)
  const guestComments = await prisma.phanHoi.findMany({
    where: {
      ma_tho_anh: null,
    },
    include: {
      hinh_anh: {
        select: {
          ma_hinh_anh: true,
          url_anh: true,
          ma_album: true,
          album: {
            select: {
              ten_alb: true,
              du_an: {
                select: {
                  ten_du_an: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      ngay_tao: "desc",
    },
  });

  // 2. Fetch replies
  const imageIds = Array.from(new Set(guestComments.map((c) => c.ma_hinh_anh)));
  const replies = await prisma.phanHoi.findMany({
    where: {
      ma_hinh_anh: { in: imageIds },
      ma_tho_anh: { not: null },
    },
    include: {
      tho_anh: {
        select: {
          ho_va_ten: true,
          vai_tro: true,
        },
      },
    },
    orderBy: {
      ngay_tao: "asc",
    },
  });

  // Helper to safely serialize prisma values for client hydration
  const serializeFeedback = (f: any) => {
    return {
      ma_phan_hoi: f.ma_phan_hoi,
      ma_hinh_anh: f.ma_hinh_anh,
      ma_tho_anh: f.ma_tho_anh,
      nguoi_binh_luan: f.nguoi_binh_luan,
      phan_hoi: f.phan_hoi,
      trang_thai: f.trang_thai,
      toa_do_X: Number(f.toa_do_X),
      toa_do_Y: Number(f.toa_do_Y),
      phan_tram_chieu_rong: Number(f.phan_tram_chieu_rong),
      phan_tram_chieu_cao: Number(f.phan_tram_chieu_cao),
      ngay_tao: f.ngay_tao instanceof Date ? f.ngay_tao.toISOString() : String(f.ngay_tao),
      tho_anh: f.tho_anh || null,
    };
  };

  // 3. Map replies to their corresponding guest comments
  const feedbacks = guestComments.map((comment) => {
    const photoReplies = replies
      .filter((r) => r.ma_hinh_anh === comment.ma_hinh_anh)
      .map(serializeFeedback);
    return {
      ...serializeFeedback(comment),
      hinh_anh: comment.hinh_anh ? {
        ma_hinh_anh: comment.hinh_anh.ma_hinh_anh,
        url_anh: comment.hinh_anh.url_anh,
        ma_album: comment.hinh_anh.ma_album,
        album: {
          ten_alb: comment.hinh_anh.album.ten_alb,
          du_an: {
            ten_du_an: comment.hinh_anh.album.du_an.ten_du_an,
          },
        },
      } : null,
      replies: photoReplies,
    };
  });

  return (
    <React.Suspense fallback={<div className="text-center py-20 text-slate-500">Đang tải phản hồi...</div>}>
      <FeedbacksClient initialFeedbacks={feedbacks} />
    </React.Suspense>
  );
}
