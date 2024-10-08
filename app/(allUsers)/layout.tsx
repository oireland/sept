import { authOptions } from "@/lib/auth";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(getURL("/signin"));
  }

  if (!session.user.emailVerified) {
    redirect(getURL("/confirm"));
  }

  return <main>{children}</main>;
}
