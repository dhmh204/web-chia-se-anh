"use client";

import React, { useState } from "react";
import CreateProject from "./CreateProject";
import ProjectStatusFlow from "./ProjectStatusFlow";
import DashboardGrid from "../../components/DashboardGrid";

const ProjectCreatorSection = () => {
  const [summary, setSummary] = useState({
    tenDuAn: "Chưa nhập",
    khachHang: "Chưa có",
    ngayChup: "Chưa chọn",
    thoAnh: "Chưa phân công",
    trangThai: "Mới",
  });

  return (
    <DashboardGrid>
      <CreateProject onValuesChange={setSummary} />
      <ProjectStatusFlow summary={summary} />
    </DashboardGrid>
  );
};

export default ProjectCreatorSection;
