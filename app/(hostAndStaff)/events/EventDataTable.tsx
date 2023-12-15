"use client";

import { DataTable } from "@/components/ui/data-table";
import getURL from "@/lib/getURL";
import { UserRole } from "@prisma/client";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { EventTableData, columns } from "./columns";

const removeSelectedEvents = async (events: EventTableData[]) => {
  let toastId = toast.loading("Deleting events...");
  try {
    let commaSeperatedIds = "";
    events.forEach(({ eventId }) => {
      commaSeperatedIds = commaSeperatedIds.concat(eventId + ",");
    });
    // to remove the comma from the end
    commaSeperatedIds = commaSeperatedIds.substring(
      0,
      commaSeperatedIds.length - 1,
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyEvents/${commaSeperatedIds}`),
    );

    toast.dismiss(toastId);
    toastId = toast.success("Events deleted!");
    window.location.reload();
  } catch (e) {
    toast.dismiss(toastId);
    if (e instanceof AxiosError) {
      toastId = toast.error(e.response?.data);
    } else {
      toastId = toast.error("Something went wrong!");
    }
  }
};

const EventDataTable = ({
  data,
  userRole,
}: {
  data: EventTableData[];
  userRole: UserRole;
}) => {
  if (userRole === "HOST") {
    return (
      <div>
        <DataTable
          columns={columns}
          data={data}
          selectedRowsAction={removeSelectedEvents}
          rowActionLabel="Delete"
        />
      </div>
    );
  } else {
    return (
      <div>
        <DataTable columns={columns.slice(1)} data={data} />
      </div>
    );
  }
};

export default EventDataTable;
