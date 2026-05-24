import Notice from "@/app/(dashboard)/components/Notice";
import Panel from "@/app/(dashboard)/components/Panel";
import ProcessItem from "@/app/(dashboard)/components/ProcessItem";
import React from "react";
import ProjectSummary from "./ProjectSummary";

const processList = [
  {
    step: 1,
    title: "Khởi tạo",
    description: "Khởi tạo thông tin và phân công thợ ảnh.",
  },
  {
    step: 2,
    title: "Đang chọn",
    description: "Khách xem album, yêu thích ảnh và phản hồi.",
  },
  {
    step: 3,
    title: "Đang sửa",
    description: "Thợ ảnh xử lý hậu kỳ theo phản hồi.",
  },
  {
    step: 4,
    title: "Hoàn thiện",
    description: "Album final đã sẵn sàng bàn giao",
  },
];

type ProjectStatusFlowProps = {
  summary?: {
    tenDuAn: string;
    khachHang: string;
    ngayChup: string;
    thoAnh: string;
    trangThai: string;
  };
};

const ProjectStatusFlow = ({ summary }: ProjectStatusFlowProps) => {
  return (
    <div className="">
      <Panel kicker="Trạng thái" title="Luồng dự án">
        <div className="grid gap-4">
          {processList.map((item) => (
            <ProcessItem key={item.step} {...item} />
          ))}
        </div>
      </Panel>
      <Panel kicker="Tóm tắt" title="Tóm tắt dự án">
        <ProjectSummary
          tenDuAn={summary?.tenDuAn}
          khachHang={summary?.khachHang}
          ngayChup={summary?.ngayChup}
          thoAnh={summary?.thoAnh}
          trangThai={summary?.trangThai}
        />
      </Panel>
    </div>
  );
};

export default ProjectStatusFlow;

