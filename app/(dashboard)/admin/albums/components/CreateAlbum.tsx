import Panel from "@/app/(dashboard)/components/Panel";
import React from "react";
import FormCreateAlb from "./FormCreateAlb";

type CreateAlbumProps = {
  projects: { value: string; name: string }[];
};

const CreateAlbum = ({ projects }: CreateAlbumProps) => {
  return (
    <Panel kicker="Album" title="Tạo/ Cấu hình Album">
      <FormCreateAlb projects={projects} />
    </Panel>
  );
};

export default CreateAlbum;
