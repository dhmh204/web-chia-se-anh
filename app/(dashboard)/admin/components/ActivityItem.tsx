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
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default ActivityItem

