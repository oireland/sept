"use client";
import { DataTable } from "@/components/ui/data-table";
import { TeamsTableData, columns } from "./columns";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";

const removeTeams = async (teams: TeamsTableData[]) => {
  let toastId = toast.loading("Deleting...");
  try {
    let commaSeperatedNames = "";
    teams.forEach(({ teamName }) => {
      commaSeperatedNames = commaSeperatedNames.concat(teamName + ",");
    });
    // to remove the comma from the end
    commaSeperatedNames = commaSeperatedNames.substring(
      0,
      commaSeperatedNames.length - 1,
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyTeams/${commaSeperatedNames}`),
    );

    toast.dismiss(toastId);
    toastId = toast.success("Teams deleted!");
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

export const TeamDataTable = ({ data }: { data: TeamsTableData[] }) => {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeTeams}
        rowActionLabel="Remove"
      />
    </div>
  );
};
