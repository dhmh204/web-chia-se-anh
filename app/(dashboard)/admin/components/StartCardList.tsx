import StatCard from '@/app/(dashboard)/admin/components/StatCard'
import React from 'react'

const startCartList = [
    {
        label: 'Tổng dự án',
        value: 0,
        description: '0 dự án trong tháng'
    },
    {
        label: 'Album đang mở',
        value: 0,
        description: 'Đang chia sẻ cho khách'
    },
    {
        label: 'Ảnh đã upload',
        value: 0,
        description: 'Lưu trên cloud'
    },
    {
        label: 'Phản hồi chờ xử lý',
        value: 0,
        description: 'Cần thợ ảnh kiểm tra'
    },
]


const StartCardList = ({ classCssCommon }: { classCssCommon: string }) => {
    return (
        <div className='grid grid-cols-[repeat(4,minmax(0,1fr))] gap-[16px] mb-[18px]' >
            {
                startCartList.map((item, index) => (
                    <StatCard
                        key={index}
                        className={classCssCommon}
                        label={item.label}
                        value={item.value}
                        description={item.description}
                    />
                ))
            }
        </div>
    )
}

export default StartCardList