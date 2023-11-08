import React from "react";
import Banner from "../../../components/banner";

import staff from "@/app/assets/images/staff.svg";
import { StaffTableData } from "./columns";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StaffDataTable from "./StaffDataTable";

async function getStaffData(userId: string): Promise<StaffTableData[]> {
  // fetch data
  const data = await prisma.staff.findMany({
    where: {
      host: {
        userId,
      },
    },
    select: {
      name: true,
      userId: true,
      events: true,
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const staff: StaffTableData[] = data.map(
    ({ name, userId, user, events }) => ({
      name,
      numberOfEvents: events.length,
      userId,
      email: user.email!,
    })
  );

  return staff;
}

const Staff = async () => {
  const session = await getServerSession(authOptions);
  const role = session!.user.role;

  const staffData = await getStaffData(session!.user.id);

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
