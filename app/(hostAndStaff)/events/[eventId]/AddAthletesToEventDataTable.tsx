"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { AthleteTableData, columns } from "../../athletes/columns";

import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const AddAthletesToEventDataTable = ({
  data,
  eventId,
}: {
  data: AthleteTableData[];
  eventId: string;
}) => {
  const addAthletesToEvent = async (selectedRowData: AthleteTableData[]) => {
    let toastId = toast.loading("Adding to event...");
    console.log(selectedRowData);
    try {
      await axios.patch(getURL("/api/update/addAthletesToEvent"), {
        eventId,
        selectedRowData,
      });

      toast.dismiss(toastId);
      toast.success("Athletes added to event!");
      window.location.reload();
    } catch (e) {
      console.log(e);
      toast.dismiss(toastId);
      if (e instanceof Error) {
        toast.error(e.message);
      } else if (e instanceof AxiosError) {
        console.log(e);
        toast.error(e.response?.data);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={addAthletesToEvent}
        rowActionLabel="Add"
      />
    </div>
  );
};

export default AddAthletesToEventDataTable;
