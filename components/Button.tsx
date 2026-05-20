import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "sm" | "outline" | "danger";
};

const baseClass = `min-h-[48px] py-0 px-4 rounded-[14px] border border-[var(--line)] bg-[rgba(255,255,255,0.055)] text-[var(--text)] inline-flex items-center justify-center gap-[8px] transition-all duration-[180ms]
   hover:translate-y-1 hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.12)]`;

const variantClass = {
  primary:
    "border-[rgba(16,185,129,0.5)] bg-[linear-gradient(135deg,#047857,#10b981)] shadow-[0_0_34px_rgba(16,185,129,0.22)]",
  secondary:
    "bg-transparent border border-[var(--line)] text-[var(--text)] hover:border-[var(--line-green)]",
  sm: "min-h-[34px] py-0 px-4 rounded-[11px] text-[13px]",
  outline: "",
  danger:
    "min-h-[34px] py-0 px-4 rounded-[11px] text-[#fecdd3] border border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.08)]",
};

const Button = ({
  children,
  variant = "primary",
  type = "button",
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(
        baseClass,
        variantClass[variant],
        disabled
          ? "opacity-50 cursor-not-allowed hover:translate-y-0"
          : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
