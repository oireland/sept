"use client";
import { DataTable } from "@/components/ui/data-table";
import { LocationsTableData, columns } from "./columns";

const removeLocations = async (locations: LocationsTableData[]) => {
  console.log(locations);
};

export const LocationDataTable = ({ data }: { data: LocationsTableData[] }) => {
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
