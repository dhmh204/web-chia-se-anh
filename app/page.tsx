import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any)?.vai_tro;

  if (role === "ADMIN") {
    redirect("/admin");
  } else if (role === "THO_ANH") {
    redirect("/photographer");
  } else {
    // Nếu có role khác (hoặc chưa define) thì có thể tuỳ chọn redirect, ở đây cho vào login
    redirect("/login");
  }
}
