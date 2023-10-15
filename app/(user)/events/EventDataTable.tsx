"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { EventTableData, columns } from "./columns";
import * as yup from "yup";
import { EventTableDataSchema } from "@/lib/yupSchemas";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const removeSelectedEvents = async (selectedRowData: EventTableData[]) => {
  let toastId = toast.loading("Deleting events...");
  try {
    const validatedData = await yup
      .array(EventTableDataSchema)
      .validate(selectedRowData);

    if (!validatedData) {
      throw new Error("Invalid Selection");
    }

    let commaSeperatedIds = "";
    validatedData.forEach(({ id }) => {
      commaSeperatedIds = commaSeperatedIds.concat(id + ",");
    });
    // to remove the comma from the end
    commaSeperatedIds = commaSeperatedIds.substring(
      0,
      commaSeperatedIds.length - 1
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyEvents/${commaSeperatedIds}`)
    );

    toast.dismiss(toastId);
    toastId = toast.success("Events deleted!");
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

const EventDataTable = ({ data }: { data: EventTableData[] }) => {
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
};

export default EventDataTable;
