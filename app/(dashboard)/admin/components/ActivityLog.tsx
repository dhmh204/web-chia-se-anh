import ActivityItem from "@/app/(dashboard)/admin/components/ActivityItem";
import React from "react";
import Panel from "../../components/Panel";

const ActivityLog = () => {
  return (
    <Panel
      kicker="Hoạt động"
      title="Nhật ký hệ thống"
      children={
        <div className="grid gap-[12px]">
          {[1, 2, 3].map((index) => (
            <ActivityItem
              key={index}
              title="Khách vừa yêu thích ảnh"
              description="Album Kỷ yếu 12A1 có 3 ảnh mới được đánh dấu yêu thích."
            />
          ))}
        </div>
      }
    ></Panel>
  );
};

export default ActivityLog;
