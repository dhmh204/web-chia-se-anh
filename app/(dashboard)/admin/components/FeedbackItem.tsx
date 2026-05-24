import Badge from "@/components/Badge";
import Image from "next/image";
import React from "react";
import Link from "next/link";

type StatusType = "editing" | "completed" | "new";

type FeedBackProps = {
  imageName: string;
  customerName: string;
  note: string;
  status: StatusType;
  srcImg: string;
  label: string;
  href?: string;
};

const FeedbackItem = ({
  imageName,
  customerName,
  note,
  status,
  srcImg,
  label,
  href = "/admin/feedbacks",
}: FeedBackProps) => {
  return (
    <Link
      href={href}
      className="group p-3.5 grid grid-cols-[76px_minmax(0,1fr)_auto] gap-3.5 items-center border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,.035)] hover:border-[#10b981]/50 hover:bg-[#10b981]/5 hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-200 cursor-pointer block text-left"
    >
      <div className="h-[64px] w-[76px] overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.09)] flex-shrink-0">
        <Image
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          width={100}
          height={100}
          src={srcImg}
          alt={imageName}
        />
      </div>
      <div className="grid gap-1 min-w-0">
        <h3 className="text-[15px] font-bold text-white group-hover:text-[#34d399] transition-colors truncate">
          {imageName} · Khách: {customerName}
        </h3>
        <p className="text-[var(--muted)] text-[13px] leading-[1.5] truncate">“{note}”</p>
      </div>
      <Badge variant={status} label={label} />
    </Link>
  );
};
export default FeedbackItem;

