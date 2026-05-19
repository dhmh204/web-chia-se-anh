import ActivityItem from '@/app/(dashboard)/admin/components/ActivityItem'
import React from 'react'

const ActivityLog = () => {
    return (
        <div className='panel'>
            <div className="mb-[18px]">
                <p className="section-kicker"
                >Hoạt động
                </p>
                <h2 className='text-[20px] tracking-[-.035em] font-bold'>Nhật ký hệ thống</h2>
            </div>
            <div className='grid gap-[12px]'>
                {[1, 2, 3].map((index) => (
                    <ActivityItem
                        key={index}
                        title="Khách vừa yêu thích ảnh"
                        description="Album Kỷ yếu 12A1 có 3 ảnh mới được đánh dấu yêu thích."
                    />
                ))}
            </div>
        </div>
    )
}

export default ActivityLog