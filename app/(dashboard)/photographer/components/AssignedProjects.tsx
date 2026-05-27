import React from "react";
import Panel from "../../components/Panel";
import TableAssignedProjects from "./TableAssignedProjects";

type props = {
  isDetails?: boolean;
  projects?: any[];
};

const AssignedProjects = ({ isDetails = false, projects = [] }: props) => {
  return (
    <Panel
      kicker="Dự án của tôi"
      title="Công việc đang phụ trách"
      description="Bạn chỉ có thể thấy được các dự án được phân công"
      textButton={!isDetails ? "Xem tất cả" : undefined}
      hrefButton={!isDetails ? "/photographer/projects" : undefined}
      download={false}
    >
      <TableAssignedProjects isDetails={isDetails} projects={projects} />
    </Panel>
  );
};

export default AssignedProjects;
