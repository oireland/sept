import Banner from "../../../components/banner";

import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { StaffTableData } from "./columns";
import dynamic from "next/dynamic";

// client components
const StaffDataTable = dynamic(() => import("./StaffDataTable"))

async function getStaffData(userId: string): Promise<StaffTableData[]> {
  // fetch data
  const data = await prisma.staff.findMany({
    where: {
      host: {
        userId,
      },
    },
    select: {
      userId: true,
      events: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const staff: StaffTableData[] = data.map(({ userId, user, events }) => ({
    name: user.name,
    numberOfEvents: events.length,
    userId,
    email: user.email!,
  }));

  return staff;
}

const Staff = async () => {
  const session = await getServerSession(authOptions);
  const role = session!.user.role;

  const staffData = await getStaffData(session!.user.userId);

  return (
    <div>
      <Banner text="Staff" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <Button variant="outline">
            <Link href={"/staff/create"}>Sign up new Staff</Link>
          </Button>
        )}
        <StaffDataTable data={staffData} />
      </div>
    </div>
  );
};

export default Staff;
