"use client";

import Button from "@/components/Button";
import Image from "next/image";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import { CustomerHeaderConfig } from "./CustomerHeaderConfig";
import { getCustomerHeaderKey } from "@/configs/customerHeaderConfig";

const Header = () => {
  const params = useParams();
  const pathname = usePathname();
  const ma_du_an = params.ma_du_an as string;

  const headerKey = getCustomerHeaderKey(pathname);

  // Hide the header entirely on the album lock/access screen
  if (headerKey === "PROJECT_ACCESS") {
    return null;
  }

  const config = CustomerHeaderConfig[headerKey];

  return (
    <div>
      <header className="sticky top-0 z-20 py-[18px] px-[28px] border-b border-b-[var(--line)] bg-[rgba(3,7,10,.78)] backdrop-blur-[16px] flex items-center justify-between gap-[18px]">
        <Image src="/images/logo.png" alt="Noofoto" width={140} height={40} />
        <div className="flex items-center gap-[12px] flex-wrap">
          {config.btns.map((btn, i) => {
            const finalHref = btn.href ? `/projects/${ma_du_an}/${btn.href}` : `/projects/${ma_du_an}`;
            return (
              <Button key={i} variant="sm" href={finalHref}>
                {btn.label}
              </Button>
            );
          })}
        </div>
      </header>
    </div>
  );
};

export default Header;
