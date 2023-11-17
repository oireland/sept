"use client";
import { DataTable } from "@/components/ui/data-table";
import { LocationsTableData, columns } from "./columns";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";

const removeLocations = async (locations: LocationsTableData[]) => {
  let toastId = toast.loading("Deleting...");
  try {
    let commaSeperatedNames = "";
    locations.forEach(({ locationName }) => {
      commaSeperatedNames = commaSeperatedNames.concat(locationName + ",");
    });
    // to remove the comma from the end
    commaSeperatedNames = commaSeperatedNames.substring(
      0,
      commaSeperatedNames.length - 1
    );

    await axios.delete(
      getURL(`/api/delete/deleteManyLocations/${commaSeperatedNames}`)
    );

    toast.dismiss(toastId);
    toastId = toast.success("Locations deleted!");
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

export default function LocationDataTable  ({ data }: { data: LocationsTableData[] })  {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        selectedRowsAction={removeLocations}
        rowActionLabel="Remove"
      />
    </div>
  );
};
