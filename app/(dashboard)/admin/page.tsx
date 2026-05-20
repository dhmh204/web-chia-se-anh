import DashboardGrid from "@/app/(dashboard)/admin/components/DashboardGrid";
import StartCardList from "@/app/(dashboard)/components/StartCardList";
import RecentProjects from "./components/RecentProjects";
import QuickActions from "./components/QuickActions";
import RecentFeedback from "./components/RecentFeedback";
import ActivityLog from "./components/ActivityLog";

const classCssCommon =
  "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]";

const adminStatList = [
  {
    label: "Tổng dự án",
    value: 0,
    description: "0 dự án trong tháng",
  },
  {
    label: "Album đang mở",
    value: 0,
    description: "Đang chia sẻ cho khách",
  },
  {
    label: "Ảnh đã upload",
    value: 0,
    description: "Lưu trên cloud",
  },
  {
    label: "Phản hồi chờ xử lý",
    value: 0,
    description: "Cần thợ ảnh kiểm tra",
  },
];

const AdminPage = () => {
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
