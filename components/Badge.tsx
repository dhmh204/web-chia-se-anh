import { Yellowtail } from "next/font/google";

type StatusVariant = "editing" | "completed" | "new" | "pending";

type BadgeProps = {
  label: string;
  variant: StatusVariant;
  className?: string;
};

const statusClassMap: Record<StatusVariant, string> = {
  editing:
    "text-[#fde68a] bg-[rgba(245,158,11,.12)] border border-[rgba(245,158,11,.22)]",

  completed:
    "text-[#86efac] bg-[rgba(16,185,129,.12)] border border-[rgba(16,185,129,.22)]",

  new: "text-[#bfdbfe] bg-[rgba(59,130,246,.12)] border border-[rgba(59,130,246,.22)]",
  pending:
    "text-[#fecdd3] bg-[rgba(244,63,94,0.13)] border-[rgba(244,63,94,0.24)]",
};

const Badge = ({ variant, label, className = "" }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-[7px] h-[28px] px-[10px] rounded-[999px] text-[12px] font-bold ${statusClassMap[variant]} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
