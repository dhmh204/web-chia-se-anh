import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectClient from "./ProjectClient";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ ma_du_an: string }>;
};

const ProjectPage = async ({ params }: PageProps) => {
  const { ma_du_an } = await params;

  if (!ma_du_an) {
    return notFound();
  }

  // Fetch project with its albums and counts
  const project = await prisma.duan.findUnique({
    where: { ma_du_an },
    include: {
      albums: {
        orderBy: {
          ngay_tao: "desc",
        },
        select: {
          ma_album: true,
          ten_alb: true,
          loai_alb: true,
          quyen_download: true,
          hinh_anh: {
            take: 1,
            select: {
              url_anh: true,
            },
          },
          _count: {
            select: {
              hinh_anh: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  // Serialize properties to avoid next payload issues
  const serializedProject = {
    ma_du_an: project.ma_du_an,
    ten_du_an: project.ten_du_an,
    ngay_chup: project.ngay_chup.toISOString(),
    link_anh_bia: project.link_anh_bia,
    hasPassword: project.mat_khau !== null && project.mat_khau.trim() !== "",
    mat_khau: project.mat_khau,
    albums: project.albums.map((album) => ({
      ma_album: album.ma_album,
      ten_alb: album.ten_alb,
      loai_alb: album.loai_alb,
      quyen_download: album.quyen_download,
      coverImage: album.hinh_anh[0]?.url_anh || null,
      photoCount: album._count.hinh_anh,
    })),
  };

  return <ProjectClient project={serializedProject} />;
};

export default ProjectPage;
