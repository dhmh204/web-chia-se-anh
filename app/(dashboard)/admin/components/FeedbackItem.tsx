import StatusBadge from '@/components/StatusBadge'
import Image from 'next/image'
import React from 'react'


type StatusType = "editing" | "completed" | "new";


type FeedBackProps = {
    imageName: string,
    customerName: string,
    note: string,
    status: StatusType,
    srcImg: string,
    label: string,
}


const FeedbackItem = ({ imageName, customerName, note, status, srcImg, label }: FeedBackProps) => {
    return (
        <div className="p-3.5 grid grid-cols-[76px_minmax(0,1fr)_auto] gap-3.5 items-center border border-[var(--line)] rounded-[18px] bg-[rgba(255,255,255,.035)]">
            <div className="h-[64px] w-[76px] overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.09)]">
                <Image
                    className="h-full w-full object-cover object-center"
                    width={100}
                    height={100}
                    src={srcImg}
                    alt={imageName}
                />
            </div>
            <div className='grid gap-3'>
                <h3 className='text-[15px] font-bold mb-1'>{imageName} · Khách: {customerName}</h3>
                <p className='text-[var(--muted)] text-[13px] leading-1.5'>“{note}”</p>
            </div>
            <StatusBadge variant={status} label={label} />
        </div>

        

    )
}
export default FeedbackItem

