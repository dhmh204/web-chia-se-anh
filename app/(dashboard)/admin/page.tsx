import DashboardGrid from '@/app/(dashboard)/admin/components/DashboardGrid'
import StartCardList from '@/app/(dashboard)/admin/components/StartCardList'

const classCssCommon = "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]"



const AdminPage = () => {
  return (
    <div>
      <div>
        <StartCardList
          classCssCommon={classCssCommon}
        />
        <DashboardGrid />
      </div>
    </div>
  )
}

export default AdminPage

