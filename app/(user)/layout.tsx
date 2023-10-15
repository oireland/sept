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
  if (!session || !session.user) {
    redirect(getURL("/signin"));
  }

  if (!session.user.isConfirmed) {
    redirect(getURL("/confirm"));
  }

  // For testing, will change URL and conditions when all pages are made
  if (!(session.user.role === "HOST" || session.user.role === "STAFF")) {
    redirect(getURL("/"));
  }

  return <main>{children}</main>;
}
