import { Yellowtail } from "next/font/google";

type StatusVariant = "editing" | "completed" | "new";

type StatusBadgeProps = {
    label: string;
    variant: StatusVariant;
};

const statusClassMap: Record<StatusVariant, string> = {
    editing:
        "text-[#fde68a] bg-[rgba(245,158,11,.12)] border border-[rgba(245,158,11,.22)]",

    completed:
        "text-[#86efac] bg-[rgba(16,185,129,.12)] border border-[rgba(16,185,129,.22)]",

    new:
        "text-[#bfdbfe] bg-[rgba(59,130,246,.12)] border border-[rgba(59,130,246,.22)]",
};

const StatusBadge = ({ variant, label }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex items-center gap-[7px] h-[28px] px-[10px] rounded-[999px] text-[12px] font-bold ${statusClassMap[variant]}`}
        >
            {label}
        </span>
    );
};

export default StatusBadge;

