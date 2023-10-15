"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { AthleteTableData, columns } from "./columns";
import * as yup from "yup";
import { AthleteTableDataSchema } from "@/lib/yupSchemas";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const removeSelectedAthletes = async (selectedRowData: AthleteTableData[]) => {
  let toastId = toast.loading("Deleting athletes...");
  try {
    let commaSeperatedIds = "";
    selectedRowData.forEach(({ userId }) => {
      commaSeperatedIds = commaSeperatedIds.concat(userId + ",");
    });
    // to remove the comma from the end
    commaSeperatedIds = commaSeperatedIds.substring(
      0,
      commaSeperatedIds.length - 1
    );
    console.log(commaSeperatedIds);

    await axios.delete(
      getURL(`/api/delete/deleteManyAthletes/${commaSeperatedIds}`)
    );

    toast.dismiss(toastId);
    toastId = toast.success("Athletes deleted!");
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

const AthleteDataTable = ({ data }: { data: AthleteTableData[] }) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeSelectedAthletes}
        rowActionLabel="Delete"
      />
    </div>
  );
};

export default AthleteDataTable;
