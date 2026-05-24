import React from "react";
import ProjectCreatorSection from "./components/ProjectCreatorSection";
import Panel from "@/app/(dashboard)/components/Panel";
import TableProjects from "./components/TableProjects";
import { prisma } from "@/lib/prisma";

const page = async () => {
  const projects = await prisma.duan.findMany({
    orderBy: {
      ngay_chup: "desc",
    },
    select: {
      ma_du_an: true,
      ten_du_an: true,
      ngay_chup: true,
      trang_thai: true,
      ma_chia_se: true,
      ghi_chu: true,
      mat_khau: true,
      khach_hang: {
        select: {
          ma_khach_hang: true,
          ho_va_ten: true,
          so_dien_thoai: true,
        },
      },
      su_phan_cong: {
        select: {
          nguoi_dung: {
            select: {
              ma_nguoi_dung: true,
              ho_va_ten: true,
            },
          },
        },
      },
    },
  });

  // Serialize Date objects to strings
  const serializedProjects = projects.map((p) => ({
    ...p,
    ngay_chup: p.ngay_chup.toISOString(),
  }));

  return (
    <div className="grid gap-[18px]">
      <ProjectCreatorSection />
      <Panel kicker="DANH SÁCH" title="Dự án hiện có">
        <TableProjects initialProjects={serializedProjects as any} />
      </Panel>
    </div>
  );
};

export default page;

