"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { EventTableData, columns } from "../../events/columns";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const AddEventsToAthleteDataTable = ({
  data,
  athleteUserId,
}: {
  data: EventTableData[];
  athleteUserId: string;
}) => {
  const addSelectedEvents = async (selectedRowData: EventTableData[]) => {
    let toastId = toast.loading("Adding events to the athlete...");
    try {
      await axios.patch(getURL("/api/update/addEventsToAthlete"), {
        selectedRowData,
        athleteUserId,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Events added!");
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
        selectedRowsAction={addSelectedEvents}
        rowActionLabel="Add"
      />
    </div>
  );
};

export default AddEventsToAthleteDataTable;
