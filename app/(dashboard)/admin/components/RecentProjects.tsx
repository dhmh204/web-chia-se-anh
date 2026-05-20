import ProjectTable from "@/app/(dashboard)/admin/components/ProjectTable";
import Button from "@/components/Button";
import React from "react";
import Panel from "../../components/Panel";

const RecentProjects = () => {
  return (
    <Panel
      kicker="Dự án gần đây"
      title="Theo dõi dự án / album"
      description="Admin xem toàn bộ dự án, phân công thợ ảnh và theo dõi trạng thái."
      textButton="Xem tất cả"
      children={<ProjectTable />}
    ></Panel>
  );
};

export default RecentProjects;
