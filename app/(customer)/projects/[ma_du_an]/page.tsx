import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ProjectBanner } from "./components/ProjectBanner";
import { AlbumsGrid } from "./components/AlbumsGrid";
import { AlbumSummary } from "./components/AlbumCard";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ ma_du_an: string }>;
};

export default async function CustomerProjectPage({ params }: PageProps) {
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

  const hasPassword =
    project.mat_khau !== null && project.mat_khau.trim() !== "";

  // Server-side check for password protection
  if (hasPassword) {
    const cookieStore = await cookies();
    const unlocked =
      cookieStore.get(`project_unlocked_${ma_du_an}`)?.value === "true";
    if (!unlocked) {
      redirect(`/projects/${ma_du_an}/access`);
    }
  }

  // Map albums to component-expected type
  const mappedAlbums: AlbumSummary[] = project.albums.map((album) => ({
    ma_album: album.ma_album,
    ten_alb: album.ten_alb,
    loai_alb: album.loai_alb,
    quyen_download: album.quyen_download,
    coverImage:
      album.hinh_anh[0]?.url_anh ||
      project.link_anh_bia ||
      "/images/example.jpg",
    photoCount: album._count.hinh_anh,
  }));

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <ProjectBanner
        ten_du_an={project.ten_du_an}
        ngay_chup={project.ngay_chup}
        link_anh_bia={project.link_anh_bia}
        albumCount={project.albums.length}
      />
      <AlbumsGrid albums={mappedAlbums} />
    </div>
  );
}
