import StatCard from '@/app/(dashboard)/components/StatCard'
import React from 'react'


type StatCardItem = {
  label: string;
  value: number | string;
  description: string;
};

type StartCardListProps = {
  classCssCommon?: string;
  data: StatCardItem[];
};

const StartCardList = ({ classCssCommon = "", data }: StartCardListProps) => {
  return (
    <div className="mb-[18px] grid grid-cols-[repeat(4,minmax(0,1fr))] gap-[16px]">
      {data.map((item, index) => (
        <StatCard
          key={index}
          className={classCssCommon}
          label={item.label}
          value={item.value}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default StartCardList;