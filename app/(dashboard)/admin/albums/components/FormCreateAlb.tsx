"use client";

import Input from "@/components/Input";
import SelectCustom from "@/components/SelectCustom";
import FormCreateProjects from "@/app/(dashboard)/admin/projects/components/FormCreateProjects";
import Modal from "@/components/Modal";
import Checkbox from "@/components/Checkbox";
import React, { useState } from "react";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";
import { useRouter } from "next/navigation";


const typeAlb = [
  {
    value: "Ảnh gốc",
    name: "ANH_GOC",
  },
  {
    value: "Hậu kỳ",
    name: "HAU_KY",
  },
  {
    value: "Final",
    name: "CUOI_CUNG",
  },
];

type FormCreateAlbProps = {
  projects: { value: string; name: string }[];
  onSuccess?: (newAlbum: {
    ma_album: string;
    ten_alb: string;
    ma_du_an: string;
    loai_alb: string;
  }) => void;
  defaultProjectId?: string;
  hideProjectField?: boolean;
};

const FormCreateAlb = ({
  projects,
  onSuccess,
  defaultProjectId,
  hideProjectField = false,
}: FormCreateAlbProps) => {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectList, setProjectList] = useState(projects);

  const [selectedProject, setSelectedProject] = useState<string>(() => {
    if (defaultProjectId && defaultProjectId !== "all") return defaultProjectId;
    return projects && projects.length > 0 ? projects[0].name : "";
  });
  const [allowDownload, setAllowDownload] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const handleProjectCreated = (newProj: {
    ma_du_an: string;
    ten_du_an: string;
  }) => {
    setProjectList((prev) => [
      ...prev,
      { value: newProj.ten_du_an, name: newProj.ma_du_an },
    ]);
    setSelectedProject(newProj.ma_du_an);
    setIsCreateProjectOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(e.currentTarget);
    const albumName = (formData.get("albumName") as string)?.trim();
    const projectId = formData.get("projects") as string;
    const typeOfAlbum = formData.get("typeOfAlbum") as string;

    if (!albumName) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng nhập tên album");
      return;
    }
    if (!projectId) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn dự án");
      return;
    }
    if (!typeOfAlbum) {
      toastNotify.error("Lỗi nhập liệu", "Vui lòng chọn loại album");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ten_album: albumName,
          ma_du_an: projectId,
          loai_album: typeOfAlbum,
          quyen_download: allowDownload,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toastNotify.success(
          "Thành công",
          data.message || "Tạo album thành công!",
        );
        setAllowDownload(false);
        setFormKey((prev) => prev + 1);
        if (projectList && projectList.length > 0) {
          setSelectedProject(projectList[0].name);
        }
        if (onSuccess) {
          onSuccess({
            ma_album: data.album.ma_album,
            ten_alb: data.album.ten_alb,
            ma_du_an: data.album.ma_du_an,
            loai_alb: data.album.loai_alb,
          });
        }
        router.refresh();

      } else {
        toastNotify.error("Thất bại", data.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi kết nối", "Không thể gửi dữ liệu tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        key={formKey}
        onSubmit={handleSubmit}
        className="flex flex-col gap-[16px]"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tên Album"
            placeholder="Nhập tên album..."
            name="albumName"
            required
          />

          {hideProjectField ? (
            <input type="hidden" name="projects" value={selectedProject} />
          ) : (
            <div className="flex items-end gap-[10px]">
              <div className="flex-1">
                <SelectCustom
                  label="Thuộc dự án"
                  name="projects"
                  values={projectList}
                  value={selectedProject}
                  onChange={(val) => setSelectedProject(val)}
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="w-[48px] h-[48px] rounded-[15px] border border-[var(--line)] bg-[rgba(255,255,255,.04)] text-[var(--text)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.12)] hover:shadow-[0_0_0_4px_rgba(16,185,129,0.08)] text-[20px]"
                title="Tạo dự án mới"
              >
                +
              </button>
            </div>
          )}

          <SelectCustom
            label="Loại album"
            name="typeOfAlbum"
            values={typeAlb}
          />

          <Checkbox
            topLabel="Quyền hạn"
            label="Cho phép khách hàng download album"
            name="allowDownload"
            checked={allowDownload}
            onChange={(e) => setAllowDownload(e.target.checked)}
            className="mt-[4px]"
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
          {isSubmitting ? "Đang lưu..." : "Lưu album"}
        </Button>
      </form>

      {isCreateProjectOpen && (
        <Modal
          onClose={() => setIsCreateProjectOpen(false)}
          title="Tạo dự án mới"
          kicker="Dự án"
        >
          <FormCreateProjects onSuccess={handleProjectCreated} />
        </Modal>
      )}
    </>
  );
};

export default FormCreateAlb;
