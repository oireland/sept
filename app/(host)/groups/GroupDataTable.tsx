"use client";
import { DataTable } from "@/components/ui/data-table";
import { GroupsTableData, columns } from "./columns";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";

const removeGroups = async (groups: GroupsTableData[]) => {
  let toastId = toast.loading("Deleting...");
  try {
    let commaSeperatedNames = "";
    groups.forEach(({ groupName }) => {
      commaSeperatedNames = commaSeperatedNames.concat(groupName + ",");
    });
    // to remove the comma from the end
    commaSeperatedNames = commaSeperatedNames.substring(
      0,
      commaSeperatedNames.length - 1,
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyGroups/${commaSeperatedNames}`),
    );

    toast.dismiss(toastId);
    toastId = toast.success("Groups deleted!");
    window.location.reload();
  } catch (e) {
    toast.dismiss(toastId);
    if (e instanceof AxiosError) {
      toast.error(e.response?.data);
    } else if (e instanceof Error) {
      toast.error(e.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

export default function GroupDataTable({ data }: { data: GroupsTableData[] }) {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeGroups}
        rowActionLabel="Remove"
      />
    </div>
  );
}
