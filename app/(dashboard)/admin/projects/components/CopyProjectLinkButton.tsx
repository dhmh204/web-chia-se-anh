"use client";

import React from "react";
import Button from "@/components/Button";
import { toastNotify } from "@/components/Toast";

type CopyProjectLinkButtonProps = {
  ma_du_an: string;
};

const CopyProjectLinkButton = ({ ma_du_an }: CopyProjectLinkButtonProps) => {
  const handleCopy = () => {
    const link = `${window.location.origin}/projects/${ma_du_an}`;
    navigator.clipboard.writeText(link);
    toastNotify.success("Thành công", "Đã copy link dự án vào clipboard.");
  };

  return (
    <Button variant="sm" onClick={handleCopy}>
      Copy link
    </Button>
  );
};

export default CopyProjectLinkButton;
