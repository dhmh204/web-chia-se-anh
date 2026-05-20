import StartCardList from "../../components/StartCardList";
import DashboardGrid from "../components/DashboardGrid";
import UsersClient from "./components/UsersClient";
import ListUsers from "./components/ListUsers";

const classCssCommon =
  "border border-[var(--line)] rounded-[22px] bg-[var(--surface)] shadow-[var(--shadow)] backdrop-blur-[16px]";

const usersStatList = [
  {
    label: "Tổng tài khoản",
    value: 0,
    description: "Admin và thợ ảnh",
  },
  {
    label: "Đang hoạt động ",
    value: 0,
    description: "Có thể đăng nhập hệ thống",
  },
  {
    label: "Thợ ảnh ",
    value: 0,
    description: "Tài khoản thuộc vai trò thợ ảnh",
  },

  {
    label: "Đã khóa",
    value: 0,
    description: "Không thể truy cập hệ thống",
  },
];

const UsersPage = () => {
  return (
    <div>
      <div>
        <StartCardList data={usersStatList} classCssCommon={classCssCommon} />
        <DashboardGrid>
          <UsersClient />
        </DashboardGrid>
        <ListUsers />
      </div>
    </div>
  );
};

export default UsersPage;
