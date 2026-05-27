import React from 'react'
import Panel from '../../components/Panel';
import QuickActionItem from '../../admin/components/QuickActionItem';
import { IoChatbubbleEllipsesSharp, IoCloudSharp } from 'react-icons/io5';
import { FaBolt, FaCommentDots } from 'react-icons/fa';

const features = [
  {
    icon: IoCloudSharp ,
    title: "Upload ảnh",
    description: "Tải ảnh lên Cloudinary và lưu vào album",
    colorIcon: "var(--green-2)",
    href: "/photographer/photos",
  },
  {
    icon: FaCommentDots,
    title: "Xem phản hồi",
    description: "Đọc nhận xét và ghi chú chỉnh sửa của khách hàng",
    colorIcon: "#f1eaf6",
    href: "/photographer/feedbacks",
  },
  {
    icon: FaBolt,
    title: "Cập nhật hậu kỳ",
    description: "Đặt mật khẩu, và quyền tải ảnh",
    colorIcon: "#fb923c",
    href: "/photographer/progress",
  },
 
];

const QuickActionsCard = () => {
  return (
    <Panel
      kicker="Thao tác nhanh"
      title="Công cụ thợ ảnh"
      children={
        <div className="grid gap-[12px]">
          {features.map((feature) => (
            <QuickActionItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              colorIcon={feature.colorIcon}
              href={feature.href}
            />
          ))}
        </div>
      }
    ></Panel>
  );
}

export default QuickActionsCard
