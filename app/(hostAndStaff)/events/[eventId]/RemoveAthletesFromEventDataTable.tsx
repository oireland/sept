"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { AthleteTableData, columns } from "../../athletes/columns";

import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const RemoveAthletesFromEventDataTable = ({
  data,
  eventId,
}: {
  data: AthleteTableData[];
  eventId: string;
}) => {
  const removeAthletesFromEvent = async (
    selectedRowData: AthleteTableData[],
  ) => {
    let toastId = toast.loading("Removing from event...");
    try {
      await axios.patch(getURL("/api/update/removeAthletesFromEvent"), {
        eventId,
        selectedRowData,
      });
      toast.dismiss(toastId);
      toast.success("Athlete(s) removed from event!");
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
        columns={columns}
        data={data}
        selectedRowsAction={removeAthletesFromEvent}
        rowActionLabel="Remove"
      />
    </div>
  );
};

export default RemoveAthletesFromEventDataTable;
