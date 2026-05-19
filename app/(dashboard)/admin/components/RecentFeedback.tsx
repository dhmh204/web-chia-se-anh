import FeedbackItem from '@/app/(dashboard)/admin/components/FeedbackItem'
import React from 'react'

const RecentFeedback = () => {
    return (
        <div className='panel'>
            <div className="mb-[18px]">
                <p className="section-kicker"
                >Phản hồi mới
                </p>
                <h2 className='text-[20px] tracking-[-.035em] font-bold'>Yêu cầu chỉnh sửa gần đây</h2>
            </div>
            <div className='grid gap-[12px]'>
                {[1, 2, 3, 4].map((index) => (
                    <FeedbackItem
                        key={index}
                        imageName={`Photo ${index}`}
                        customerName="Customer Name"
                        note="Chỉnh chỗ này nha"
                        status="new"
                        label="Mới"
                        srcImg="/images/example.jpg"
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentFeedback
