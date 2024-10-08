"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import {
  EventTableData,
  columns,
  columnsAthleteView,
} from "../../../(hostAndStaff)/events/columns";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

const AddEventsToAthleteDataTable = ({
  data,
  athleteUserId,
}: {
  data: EventTableData[];
  athleteUserId: string;
}) => {
  const session = useSession({ required: true });

  const addSelectedEvents = async (selectedRowData: EventTableData[]) => {
    let toastId = toast.loading("Adding events to the athlete...");
    try {
      await axios.patch(getURL("/api/update/addEventsToAthlete"), {
        eventIds: selectedRowData.map(({ eventId }) => eventId),
        athleteUserId,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Events added!");
      window.location.reload();
    } catch (e) {
      toast.dismiss(toastId);
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toastId = toast.error(e.response?.data);
      } else {
        toastId = toast.error("Something went wrong!");
      }
    }
  };
  return (
    <div>
      <DataTable
        columns={
          session.status === "authenticated"
            ? session.data.user.role === "ATHLETE"
              ? columnsAthleteView
              : columns
            : []
        } // remove the actions and staffName column for athletes
        data={data}
        selectedRowsAction={addSelectedEvents}
        rowActionLabel="Add"
      />
    </div>
  );
};

export default AddEventsToAthleteDataTable;
