import ActivityLog from '@/app/(dashboard)/admin/components/ActivityLog'
import QuickActions from '@/app/(dashboard)/admin/components/QuickActions'
import RecentFeedback from '@/app/(dashboard)/admin/components/RecentFeedback'
import RecentProjects from '@/app/(dashboard)/admin/components/RecentProjects'
import React from 'react'

const DashboardGrid = () => {
    return (
        <>
            <div className="grid grid-cols-[1.45fr_.9fr] gap-[18px] mb-[18px]" >
                <RecentProjects />
                <QuickActions />
            </div>
            <div className="grid grid-cols-[1.45fr_.9fr] gap-[18px] mb-[18px]" >
                <RecentFeedback />
                <ActivityLog />
            </div>
        </>
    )
}

export default DashboardGrid

