import Button from "@/components/Button";
import React from "react";

type PanelProp = {
  kicker: string;
  title: string;
  description?: string;
  textButton?: string;
  hrefButton?: string;
  children: React.ReactNode;
};

const Panel = ({
  kicker,
  title,
  description,
  textButton,
  hrefButton,
  children,
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
        {textButton && (
          hrefButton ? (
            <a href={hrefButton} download>
              <Button variant="sm">{textButton}</Button>
            </a>
          ) : (
            <Button variant="sm">{textButton}</Button>
          )
        )}
      </div>
      {children}
    </div>
  );
};

export default Panel;
