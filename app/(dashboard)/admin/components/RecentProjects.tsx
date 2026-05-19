import ProjectTable from '@/app/(dashboard)/admin/components/ProjectTable'
import Button from '@/components/Button'
import React from 'react'

const RecentProjects = () => {
    return (
        <div className='panel'>
            <div className="flex items-start justify-between gap-[18px] mb-[18px]">
                <div>
                    <p className="section-kicker"
                    >Dự án gần đây</p>
                    <h2 className='text-[20px] tracking-[-.035em] font-bold'>Theo dõi dự án / album</h2>
                    <p className="text-[var(--muted)] text-[13px] mt-[7px] leading-[1.5]">Admin xem toàn bộ dự án, phân công thợ ảnh và theo dõi trạng thái.</p>
                </div>
                <Button variant="sm" >Xem tất cả</Button>
            </div>

            <ProjectTable />
        </div>
    )
}

export default RecentProjects

