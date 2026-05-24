import DashboardGrid from "@/app/(dashboard)/admin/components/DashboardGrid";
import StartCardList from "@/app/(dashboard)/components/StartCardList";
import RecentProjects from "./components/RecentProjects";
import QuickActions from "./components/QuickActions";
import RecentFeedback from "./components/RecentFeedback";
import ActivityLog from "./components/ActivityLog";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

const classCssCommon =
  "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]";

const AdminPage = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Run stats queries in parallel
  const [
    totalProjectsCount,
    projectsThisMonth,
    activeAlbumsCount,
    totalPhotosCount,
    pendingFeedbacksCount,
  ] = await Promise.all([
    prisma.duan.count(),
    prisma.duan.count({
      where: {
        ngay_tao: {
          gte: startOfMonth,
        },
      },
    }),
    prisma.album.count({
      where: {
        du_an: {
          trang_thai: {
            in: ["MOI", "DANG_CHON", "DANG_SUA"],
          },
        },
      },
    }),
    prisma.hinhAnh.count(),
    prisma.phanHoi.count({
      where: {
        trang_thai: "CHUA_XU_LY",
      },
    }),
  ]);

  const adminStatList = [
    {
      label: "Tổng dự án",
      value: totalProjectsCount,
      description: `${projectsThisMonth} dự án mới trong tháng`,
    },
    {
      label: "Album đang mở",
      value: activeAlbumsCount,
      description: "Đang chia sẻ cho khách",
    },
    {
      label: "Ảnh đã upload",
      value: totalPhotosCount,
      description: "Lưu trên cloud",
    },
    {
      label: "Phản hồi chờ xử lý",
      value: pendingFeedbacksCount,
      description: "Cần thợ ảnh kiểm tra",
    },
  ];

  return (
    <div>
      <div>
        <StartCardList data={adminStatList} classCssCommon={classCssCommon} />
        <DashboardGrid>
          <RecentProjects />
          <QuickActions />
          <RecentFeedback />
          <ActivityLog />
        </DashboardGrid>
      </div>
    </div>
  );
};

export default AdminPage;
