"use client";

import React, { useState } from 'react';
import Table from '@/components/Table';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { formatTrangThaiDuAn, getBadgeVariantForProject } from '@/lib/format';
import { toastNotify } from '@/components/Toast';

type ProjectSummaryType = {
  ma_du_an: string;
  ten_du_an: string;
  trang_thai: "MOI" | "DANG_CHON" | "DANG_SUA" | "HOAN_THANH";
  ngay_chup: string;
  ghi_chu: string;
  mat_khau: string | null;
  ma_chia_se: string;
  khach_hang: {
    ho_va_ten: string;
    so_dien_thoai: string;
  } | null;
  albumsCount: number;
  photosCount: number;
  feedbacksCount: number;
};

type Props = {
  isDetails?: boolean;
  projects?: ProjectSummaryType[];
};

const ProjectInforItem = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex justify-between gap-[18px] p-3.5 border border-[var(--line)] rounded-[16px] bg-[rgba(255,255,255,0.04)]">
      <span className="text-[var(--muted)] text-[13px]">{title}</span>
      <strong className="text-right text-[14px] text-white truncate max-w-[220px]">{value}</strong>
    </div>
  );
};

const TableAssignedProjects = ({ isDetails = false, projects = [] }: Props) => {
  const headers = ["Dự án", "Album", "Ảnh", "Phản hồi", "Trạng thái", isDetails ? "Thao tác" : ""];

  const [selectedProject, setSelectedProject] = useState<ProjectSummaryType | null>(null);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const handleCopyLink = (maDuAn: string) => {
    try {
      const projectLink = `${window.location.origin}/projects/${maDuAn}`;
      navigator.clipboard.writeText(projectLink);
      toastNotify.success("Thành công", "Đã sao chép liên kết dự án!");
    } catch (err) {
      console.error(err);
      toastNotify.error("Lỗi", "Không thể sao chép liên kết.");
    }
  };

  return (
    <>
      <Table headers={headers}>
        {projects.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="text-center py-6 text-[var(--muted)] text-[13px]">
              Bạn chưa có dự án nào được giao.
            </td>
          </tr>
        ) : (
          projects.map((project) => (
            <tr key={project.ma_du_an}>
              <td>
                <strong className="block font-semibold text-[14px] text-white">
                  {project.ten_du_an}
                </strong>
                <span className="text-[11px] text-[var(--muted)] font-medium">
                  Ngày chụp: {formatDate(project.ngay_chup)}
                </span>
              </td>
              <td>{project.albumsCount} album</td>
              <td>{project.photosCount} ảnh</td>
              <td>{project.feedbacksCount} bình luận</td>
              <td>
                <Badge
                  variant={getBadgeVariantForProject(project.trang_thai)}
                  label={formatTrangThaiDuAn(project.trang_thai)}
                />
              </td>
              {isDetails && (
                <td>
                  <div className="flex gap-[8px] flex-wrap">
                    <Button href={`/photographer/albums/${project.ma_du_an}`} variant="sm">
                      Album

                    </Button>
                    <Button variant="sm"
                      href={`/photographer/projects/${project.ma_du_an}`}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </Table>


    </>
  );
};

export default TableAssignedProjects;
