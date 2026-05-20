import DotComponent from '@/components/DotComponent'
import React from 'react'

type ActivityItemProps = {
    title: string,
    description: string
}


const ActivityItem = ({ title, description }: ActivityItemProps) => {
    return (
        <div className="flex gap-3 rounded-[18px] border border-[var(--line)] bg-[rgba(255,255,255,0.035)] p-3.5">
            <DotComponent />
            <div className="activity-item">
                <h3 className='text-[14px] mb-[4px] font-bold'>{title}</h3>
                <p className='text-[var(--muted)] text-[13px] leading-1.5'>{description}</p>
            </div>
        </div>
    )
}

export default ActivityItem

