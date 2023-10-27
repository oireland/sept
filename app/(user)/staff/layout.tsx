import { authOptions } from "@/lib/auth";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "HOST") {
    redirect(getURL("/"));
  }

  return <main>{children}</main>;
}
