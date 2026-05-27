import React from 'react'
import StartCardList from '../components/StartCardList';
import DashboardGrid from '../admin/components/DashboardGrid';
import AssignedProjects from './components/AssignedProjects';
import QuickActionsCard from './components/QuickActionsCard';
import RecentFeedback from '../admin/components/RecentFeedback';
import ActivityLog from '../admin/components/ActivityLog';

const classCssCommon =
  "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]";

 const photographerList = [
    {
      label: "Dự án được giao",
      value: 0,
      description: `Dự án đang xử lý`,
    },
    {
      label: "Album đang mở",
      value: 0,
      description: "Đang chia sẻ cho khách",
    },
    {
      label: "Ảnh cần hậu kỳ",
      value: 0,
      description: "Từ ảnh yêu thích/phản hồi",
    },
    {
      label: "Phản hồi mới",
      value: 0,
      description: "Cần kiểm tra",
    },
  ];

const PhotographerPage = () => {
  return (
    <div>
        <StartCardList data={photographerList} classCssCommon={classCssCommon} />
        <DashboardGrid>
          <AssignedProjects />
          <QuickActionsCard />
        </DashboardGrid>
        {/* <DashboardGrid>
             <RecentFeedback />
          <ActivityLog />
        </DashboardGrid> */}
    </div>
  )
}

export default PhotographerPage
