"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { EventTableData, columns } from "@/app/(hostAndStaff)/events/columns";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const RemoveEventsFromStaffDataTable = ({
  data,
  staffUserId,
}: {
  data: EventTableData[];
  staffUserId: string;
}) => {
  const removeSelectedEvents = async (selectedRowData: EventTableData[]) => {
    let toastId = toast.loading("Removing events from the staff member...");
    try {
      await axios.patch(getURL("/api/update/removeEventsFromStaff"), {
        selectedRowData,
        staffUserId,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Events removed!");
      window.location.reload();
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof Error || e instanceof AxiosError) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeSelectedEvents}
        rowActionLabel="Remove"
      />
    </div>
  );
};

export default RemoveEventsFromStaffDataTable;
