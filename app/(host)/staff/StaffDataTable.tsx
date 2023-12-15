"use client";

import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { StaffTableData, columns } from "./columns";
import * as yup from "yup";
import { StaffTableDataSchema } from "@/lib/yupSchemas";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import toast from "react-hot-toast";

const removeSelectedStaff = async (selectedRowData: StaffTableData[]) => {
  let toastId = toast.loading("Deleting...");
  try {
    const validatedData = await yup
      .array(StaffTableDataSchema)
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
      commaSeperatedIds.length - 1,
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyOfHostsUsers/${commaSeperatedIds}`),
    );

    toast.dismiss(toastId);
    toastId = toast.success("Staff deleted!");
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

const StaffDataTable = ({ data }: { data: StaffTableData[] }) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeSelectedStaff}
        rowActionLabel="Delete"
      />
    </div>
  );
};

export default StaffDataTable;
