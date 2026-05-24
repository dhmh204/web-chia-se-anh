import React from "react";
import StartCardList from "../../components/StartCardList";
import DashboardGrid from "../components/DashboardGrid";
import CreateCustomer from "./components/CreateCustomer";
import { prisma } from "@/lib/prisma";
import CustomerManagementFlow from "./components/CustomerManagementFlow";
import TablesCustomer from "./components/TablesCustomer";

const CustomerPage = async () => {
  // Fetch project options for dropdown
  const projects = await prisma.duan.findMany({
    orderBy: {
      ten_du_an: "asc",
    },
    select: {
      ma_du_an: true,
      ten_du_an: true,
    },
  });

  const projectOptions = projects.map((p) => ({
    value: p.ten_du_an,
    name: p.ma_du_an,
  }));

  // Fetch complete customers list for table
  const dbCustomers = await prisma.khachHang.findMany({
    orderBy: {
      ngay_tao: "desc",
    },
    include: {
      du_an: {
        select: {
          ma_du_an: true,
          ten_du_an: true,
          trang_thai: true,
        },
      },
    },
  });

  // Fetch statistics from database
  const totalCustomers = await prisma.khachHang.count();
  const totalProjects = await prisma.duan.count();

  // Find top customer with most projects
  const topCustomerQuery = await prisma.duan.groupBy({
    by: ["ma_khach_hang"],
    _count: {
      ma_khach_hang: true,
    },
    where: {
      ma_khach_hang: {
        not: null,
      },
    },
    orderBy: {
      _count: {
        ma_khach_hang: "desc",
      },
    },
    take: 1,
  });

  let topCustomerName = "Chưa có";
  if (topCustomerQuery.length > 0 && topCustomerQuery[0].ma_khach_hang) {
    const kh = await prisma.khachHang.findUnique({
      where: { ma_khach_hang: topCustomerQuery[0].ma_khach_hang },
      select: { ho_va_ten: true },
    });
    if (kh) {
      topCustomerName = kh.ho_va_ten;
    }
  }

  // Count returning customers (who have >= 2 projects)
  const customersWithMultipleProjects = await prisma.duan.groupBy({
    by: ["ma_khach_hang"],
    _count: {
      ma_khach_hang: true,
    },
    where: {
      ma_khach_hang: {
        not: null,
      },
    },
    having: {
      ma_khach_hang: {
        _count: {
          gte: 2,
        },
      },
    },
  });

  const returningCount = customersWithMultipleProjects.length;
  const returningRate =
    totalCustomers > 0
      ? Math.round((returningCount / totalCustomers) * 100)
      : 0;

  const customerStatList = [
    {
      label: "Tổng số khách hàng",
      value: totalCustomers,
      description: "Khách hàng đã lưu",
    },
    {
      label: "Tỷ lệ khách quay lại",
      value: `${returningRate}%`,
      description: "Khách chụp từ 2 lần trở lên",
    },
    {
      label: "Tổng số lượt chụp",
      value: totalProjects,
      description: "Tổng số dự án đã thực hiện",
    },
    {
      label: "Khách hàng thân thiết",
      value: topCustomerName,
      description: "Đặt lịch chụp nhiều nhất",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StartCardList data={customerStatList} />
      <DashboardGrid>
        <CreateCustomer projects={projectOptions} />
        <CustomerManagementFlow />
      </DashboardGrid>
      <TablesCustomer customers={dbCustomers as any} />
    </div>
  );
};

export default CustomerPage;

