import React from 'react'
type StatItemProps = {
    label: string;
    value: number | string;
    description: string;
    className?: string;
}

const itemAfterCss = `relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-[rgba(8,13,12,0.72)] p-[22px] 
                    after:content-[''] after:absolute after:right-[-20px] after:bottom-[-34px] after:w-[118px] after:h-[118px] 
                    after:rounded-full after:bg-[rgba(16,185,129,0.12)] after:blur-[8px]`


const StatCard = ({ label, value, description, className = "" }: StatItemProps) => {
    return (
        <div className={`p-[20px] relative overflow-hidden ${className} ${itemAfterCss}`}>
            <p className='text-[var(--muted)] text-[13px]'>{label}</p>
            <h2 className='font-semibold text-[var(--green-2)] text-[34px] letter-spacing-[-.04em] vertical-align: inherit;'>{value}</h2>
            <span className='text-[var(--muted-2)] text-[12px]'>{description}</span>
        </div>
    )
}

export default StatCard



