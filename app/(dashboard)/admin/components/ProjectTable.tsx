import { prisma } from "@/lib/prisma";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { formatTrangThaiDuAn, getBadgeVariantForProject } from "@/lib/format";
import React from "react";

const headers = ["Dự án", "Thợ ảnh", "Album", "Trạng thái", "Thao tác"];

const ProjectTable = async () => {
  const projects = await prisma.duan.findMany({
    orderBy: {
      ngay_tao: "desc",
    },
    take: 5,
    select: {
      ma_du_an: true,
      ten_du_an: true,
      trang_thai: true,
      albums: {
        select: {
          ten_alb: true,
        },
      },
      su_phan_cong: {
        select: {
          nguoi_dung: {
            select: {
              ho_va_ten: true,
            },
          },
        },
      },
    },
  });

  return (
    <Table headers={headers} id="recentProjectsTableBody">
      {projects.map((project) => {
        const photographers = project.su_phan_cong
          .map((spc) => spc.nguoi_dung.ho_va_ten)
          .join(", ");

        const albumNames = project.albums.map((a) => a.ten_alb).join(", ");

        return (
          <tr key={project.ma_du_an}>
            <td>
              <strong className="block font-semibold text-[14px]">
                {project.ten_du_an}
              </strong>
            </td>
            <td>{photographers || "Chưa phân công"}</td>
            <td>{albumNames || "Chưa có album"}</td>
            <td>
              <Badge
                variant={getBadgeVariantForProject(project.trang_thai)}
                label={formatTrangThaiDuAn(project.trang_thai)}
              />
            </td>
            <td>
              <Button variant="sm" href={`/admin/projects/${project.ma_du_an}`}>
                Chi tiết
              </Button>
            </td>
          </tr>
        );
      })}
    </Table>
  );
};

export default ProjectTable;
