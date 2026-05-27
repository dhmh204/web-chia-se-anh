import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import FormCreateAlb from "./FormCreateAlb";

type CreateAlbumProps = {
  projects: { value: string; name: string }[];
  role?: "admin" | "photographer";
};

const CreateAlbum = ({ projects, role = "admin" }: CreateAlbumProps) => {
  return (
    <Panel kicker="Album" title="Tạo/ Cấu hình Album">
      <FormCreateAlb projects={projects} role={role} />
    </Panel>
  );
};

export default CreateAlbum;
