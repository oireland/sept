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

  return <main>{children}</main>;
}

// NOTE: Update Protecting Pages in the Complex Code section of document when changes are made to this.
