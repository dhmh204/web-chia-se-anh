import FeedbackItem from "@/app/(dashboard)/admin/components/FeedbackItem";
import React from "react";
import Panel from "../../components/Panel";
import { prisma } from "@/lib/prisma";

const RecentFeedback = async () => {
  const recentComments = await prisma.phanHoi.findMany({
    where: {
      ma_tho_anh: null, // Only guest/customer feedbacks
    },
    orderBy: {
      ngay_tao: "desc",
    },
    take: 4,
    include: {
      hinh_anh: {
        select: {
          url_anh: true,
        },
      },
    },
  });

  return (
    <Panel
      kicker="Phản hồi mới"
      title="Yêu cầu chỉnh sửa gần đây"
      children={
        <div className="grid gap-[12px]">
          {recentComments.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-[13.5px] border border-white/5 bg-white/[0.01] rounded-[18px]">
              Chưa có phản hồi nào từ khách hàng
            </div>
          ) : (
            recentComments.map((comment) => {
              let badgeStatus: "new" | "editing" | "completed" = "new";
              let statusLabel = "Mới";

              if (comment.trang_thai === "DANG_XU_LY") {
                badgeStatus = "editing";
                statusLabel = "Đang sửa";
              } else if (comment.trang_thai === "DA_XU_LY") {
                badgeStatus = "completed";
                statusLabel = "Xong";
              }

              const imageName = comment.hinh_anh?.url_anh.split("/").pop()?.split("?")[0] || "photo.jpg";

              return (
                <FeedbackItem
                  key={comment.ma_phan_hoi}
                  imageName={imageName}
                  customerName={comment.nguoi_binh_luan}
                  note={comment.phan_hoi}
                  status={badgeStatus}
                  label={statusLabel}
                  srcImg={comment.hinh_anh?.url_anh || "/images/example.jpg"}
                  href={`/admin/feedbacks?focus=${comment.ma_phan_hoi}`}
                />
              );
            })
          )}
        </div>
      }
    />
  );
};

export default RecentFeedback;
