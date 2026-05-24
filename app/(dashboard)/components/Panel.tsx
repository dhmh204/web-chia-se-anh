import Button from "@/components/Button";
import React from "react";

type PanelProp = {
  kicker: string;
  title: string;
  description?: string;
  textButton?: string;
  hrefButton?: string;
  variant?: "primary" | "secondary" | "sm" | "outline" | "danger";
  children: React.ReactNode;
  onClick?: () => void;
};

const Panel = ({
  kicker,
  title,
  description,
  textButton,
  hrefButton,
  variant = "sm",
  children,
  onClick,
}: PanelProp) => {
  return (
    <div className="mb-[18px] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-[22px] shadow-[var(--shadow)] backdrop-blur-[16px]">
      <div className="flex items-start justify-between gap-[18px] mb-[18px]">
        <div>
          <p className="text-[var(--green)] text-[11px] font-extrabold tracking-[0.18em] uppercase mt-[7px]">
            {kicker}
          </p>
          <h2 className="text-[20px] tracking-[-.035em] font-bold">{title}</h2>
          {description && (
            <p className="text-[var(--muted)] text-[13px] mt-[7px] leading-[1.5]">
              {description}
            </p>
          )}
        </div>
        {textButton &&
          (hrefButton ? (
            <a href={hrefButton} download>
              <Button variant={variant}>{textButton}</Button>
            </a>
          ) : (
            <Button variant={variant} onClick={onClick}>
              {textButton}
            </Button>
          ))}
      </div>
      {children}
    </div>
  );
};

export default Panel;
