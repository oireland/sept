import Banner from "../../../components/banner";

import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { getEventData } from "@/lib/dbHelpers";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { EventTableData } from "./columns";
import dynamic from "next/dynamic";

const EventDataTable = dynamic(() => import("./EventDataTable"));

const Events = async () => {
  const session = await getServerSession(authOptions);

  const role = session!.user.role;

  const data: EventTableData[] = await getEventData(session!.user.userId, role);
  console.log(data);

  return (
    <div>
      <Banner text="Events" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <div className="flex space-x-1">
            <Button variant="outline">
              <Link href={"/events/create"}>Create new events</Link>
            </Button>
            <Button variant="outline">
              <Link href={"/records/create"}>Add records</Link>
            </Button>
          </div>
        )}
        <EventDataTable userRole={role} data={data} />
      </div>
    </div>
  );
};

export default Events;
