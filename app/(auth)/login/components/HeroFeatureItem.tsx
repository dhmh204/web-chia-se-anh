import { Folder } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";
import { FaFolder } from "react-icons/fa";

type HeroFeatureItemProps = {
  icon: IconType;
  title: string;
  description: string;
  colorIcon: string;
  className?: string;
};

const HeroFeatureItem = ({
  icon: Icon,
  title,
  description,
  colorIcon,
  className = ""
}: HeroFeatureItemProps) => {
  return (
    <div className={`flex gap-[14px]  items-center p-[16px] border rounded-[20px] bg-[rgba(255,255,255,0.035)] border-[var(--line)] ${className}`}>
      <div className=" w-[44px] h-[44px] border border-[rgba(16,185,129,0.24)] rounded-[15px] grid place-items-center bg-[rgba(16,185,129,0.12)]">
        <Icon style={{ color: colorIcon }} />
      </div>
      <div>
        <h3 className="text-[15px] mb-[4px] font-bold">{title}</h3>
        <p className="text-[var(--muted)] text-[13px]">{description}</p>
      </div>
    </div>
  );
};

export default HeroFeatureItem;
