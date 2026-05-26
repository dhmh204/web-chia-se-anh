import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LandingClient from "./(customer)/LandingClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LandingClient />;
  }

  const role = (session.user as any)?.vai_tro;

  if (role === "ADMIN") {
    redirect("/admin");
  } else if (role === "THO_ANH") {
    redirect("/photographer");
  } else {
    // Nếu có role khác (hoặc chưa define) thì hiển thị landing page
    return <LandingClient />;
  }
}
