import React from 'react'
import { IconType } from 'react-icons';

type QuickActionItemProps = {
    icon: IconType;
    title: string;
    description: string;
    href: string;
    colorIcon?: string;
}

const QuickActionItem = ({ icon: Icon, title, description, href, colorIcon }: QuickActionItemProps) => {
    return (
        <a className="flex gap-[14px]  items-center p-[16px] border rounded-[20px] bg-[rgba(255,255,255,0.035)] border-[var(--line)]
        hover:border-[var(--line-green)] hover:bg-[rgba(16,185,129,0.08)]
        " href={href}>
            <div className=" w-[44px] h-[44px] border border-[rgba(16,185,129,0.24)] rounded-[15px] grid place-items-center bg-[rgba(16,185,129,0.12)]">
                <Icon style={{ color: colorIcon }} />
            </div>
            <div>
                <h3 className="text-[14px] mb-[4px] font-bold">{title}</h3>
                <p className="text-[var(--muted)] text-[12px] leading-[1.5]">{description}</p>
            </div>
        </a>

    )
}

export default QuickActionItem
