import React from "react";
import FormCreateProjects from "./FormCreateProjects";
import Panel from "@/app/(dashboard)/components/Panel";

type CreateProjectProps = {
  onValuesChange?: (values: {
    tenDuAn: string;
    khachHang: string;
    ngayChup: string;
    thoAnh: string;
    trangThai: string;
  }) => void;
};

const CreateProject = ({ onValuesChange }: CreateProjectProps) => {
  return (
    <Panel
      kicker="Dự án"
      title="Tạo dự án mới"
      description="Dự án là gói chụp/sự kiện, có thể gồm nhiều album."
    >
      <FormCreateProjects onValuesChange={onValuesChange} />
    </Panel>
  );
};

export default CreateProject;

