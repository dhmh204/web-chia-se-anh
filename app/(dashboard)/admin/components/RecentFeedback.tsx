import FeedbackItem from "@/app/(dashboard)/admin/components/FeedbackItem";
import React from "react";
import Panel from "../../components/Panel";

const RecentFeedback = () => {
  return (
    <Panel
      kicker="Phản hồi mới"
      title="Yêu cầu chỉnh sửa gần đây"
      children={
        <div className="grid gap-[12px]">
          {[1, 2, 3, 4].map((index) => (
            <FeedbackItem
              key={index}
              imageName={`Photo ${index}`}
              customerName="Customer Name"
              note="Chỉnh chỗ này nha"
              status="new"
              label="Mới"
              srcImg="/images/example.jpg"
            />
          ))}
        </div>
      }
    ></Panel>
  );
};

export default RecentFeedback;
