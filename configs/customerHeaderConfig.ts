import { CustomerHeaderConfig } from "@/app/(customer)/components/CustomerHeaderConfig";

export type CustomerHeaderKey = keyof typeof   CustomerHeaderConfig;

export function getCustomerHeaderKey(pathname: string): CustomerHeaderKey {
  if (/^\/projects\/[^/]+\/favorites$/.test(pathname)) {
    return "PROJECT_FAVORITES";
  }

  if (/^\/projects\/[^/]+\/status$/.test(pathname)) {
    return "PROJECT_STATUS";
  }

  if (/^\/projects\/[^/]+\/access$/.test(pathname)) {
    return "PROJECT_ACCESS";
  }

  if (/^\/projects\/[^/]+\/photo\/[^/]+$/.test(pathname)) {
    return "PROJECT_PHOTO_DETAIL";
  }

  if (/^\/projects\/[^/]+$/.test(pathname)) {
    return "PROJECT_DETAIL";
  }

  return "PROJECT_DETAIL";
}