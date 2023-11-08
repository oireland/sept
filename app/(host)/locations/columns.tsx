"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type LocationsTableData = {
  locationName: string;
  locationId: string;
  numberOfEvents: number;
};

export const columns: ColumnDef<LocationsTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "locationName",
    id: "Location",
    header: () => <div className="text-left">Location</div>,
  },
  {
    accessorKey: "numberOfEvents",
    id: "# of Events",
    header: () => <div className="text-left"># of Events</div>,
  },
];
