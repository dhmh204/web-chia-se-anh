import React from "react";
import { IoChatbubble, IoSparkles } from "react-icons/io5";
import HeroFeatureItem from "./HeroFeatureItem";
import { FaFolder } from "react-icons/fa";

const features = [
  {
    icon: FaFolder,
    title: "Quản lý album bảo mật",
    description: "Khách truy cập bằng link và mật khẩu album.",
    colorIcon: "#ffd059"
  },
  {
    icon: IoChatbubble,
    title: "Phản hồi trực tiếp trên ảnh",
    description: "Ghim vùng cần sửa, bình luận và theo dõi trạng thái.",
    colorIcon: "#f1eaf6"

  },
  {
    icon: IoSparkles,
    title: "Tìm kiếm ảnh bằng AI",
    description: "Tìm theo khuôn mặt, ngữ nghĩa và nhãn ảnh.",
    colorIcon: "#34d399"

  },
];

const HeroFeatureList = () => {
  return (
    <div className="grid gap-[16px] max-w-[570px]">
      {features.map((feature, index) => (
        <HeroFeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          colorIcon={feature.colorIcon}
        />
      ))}
    </div>
  );
};

export default HeroFeatureList;
