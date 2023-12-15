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

const RemoveEventsFromAthlete = ({
  data,
  athleteUserId,
}: {
  data: EventTableData[];
  athleteUserId: string;
}) => {
  const session = useSession();
  const removeSelectedEvents = async (selectedRowData: EventTableData[]) => {
    let toastId = toast.loading("Removing events from the athlete...");
    try {
      await axios.patch(getURL("/api/update/removeEventsFromAthlete"), {
        eventIds: selectedRowData.map(({ eventId }) => eventId),
        athleteUserId,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Events removed!");
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
  return (
    <div>
      <DataTable
        columns={
          session.status === "authenticated"
            ? session.data.user.role === "ATHLETE"
              ? columnsAthleteView
              : columns
            : []
        }
        data={data}
        selectedRowsAction={removeSelectedEvents}
        rowActionLabel="Remove"
      />
    </div>
  );
};

export default RemoveEventsFromAthlete;
