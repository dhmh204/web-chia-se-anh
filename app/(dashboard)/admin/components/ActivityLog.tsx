import ActivityItem from "@/app/(dashboard)/admin/components/ActivityItem";
import React from "react";
import Panel from "../../components/Panel";
import { prisma } from "@/lib/prisma";

const ActivityLog = async () => {
  // Fetch recent data in parallel
  const [recentFeedbacks, recentProjects, recentAlbums] = await Promise.all([
    prisma.phanHoi.findMany({
      orderBy: { ngay_tao: "desc" },
      take: 3,
      include: {
        hinh_anh: {
          include: {
            album: true,
          },
        },
      },
    }),
    prisma.duan.findMany({
      orderBy: { ngay_tao: "desc" },
      take: 3,
    }),
    prisma.album.findMany({
      orderBy: { ngay_tao: "desc" },
      take: 3,
      include: {
        du_an: true,
      },
    }),
  ]);

  // Combine and map to activity items
  const activities = [
    ...recentFeedbacks.map((f) => ({
      id: f.ma_phan_hoi,
      title: f.ma_tho_anh !== null ? "Thợ ảnh phản hồi" : "Khách yêu thích / bình luận",
      description: `Bình luận trên album "${f.hinh_anh.album.ten_alb}": "${f.phan_hoi}"`,
      date: f.ngay_tao,
    })),
    ...recentProjects.map((p) => ({
      id: p.ma_du_an,
      title: "Dự án mới",
      description: `Dự án "${p.ten_du_an}" đã được khởi tạo thành công.`,
      date: p.ngay_tao,
    })),
    ...recentAlbums.map((a) => ({
      id: a.ma_album,
      title: "Album mới",
      description: `Album "${a.ten_alb}" được thêm vào dự án "${a.du_an.ten_du_an}".`,
      date: a.ngay_tao,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  return (
    <Panel
      kicker="Hoạt động"
      title="Nhật ký hệ thống"
      children={
        <div className="grid gap-[12px]">
          {activities.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-[13.5px] border border-white/5 bg-white/[0.01] rounded-[18px]">
              Chưa có hoạt động nào được ghi nhận
            </div>
          ) : (
            activities.map((act) => (
              <ActivityItem
                key={act.id}
                title={act.title}
                description={act.description}
              />
            ))
          )}
        </div>
      }
    />
  );
};

export default ActivityLog;
