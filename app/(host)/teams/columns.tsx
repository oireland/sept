"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type TeamsTableData = {
  teamName: string;
  numberOfAthletes: number;
  teamColour: string;
};

export const columns: ColumnDef<TeamsTableData>[] = [
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
    accessorKey: "teamName",
    id: "Team",
    header: () => <div className="text-left">Team</div>,
    cell({ row }) {
      return (
        <div className="flex space-x-2 items-center">
          <div
            className="h-6 w-6 rounded-md border-2"
            style={{ backgroundColor: row.original.teamColour }}
          ></div>
          <span>{row.original.teamName}</span>{" "}
        </div>
      );
    },
  },
  {
    accessorKey: "numberOfAthletes",
    id: "# of Athletes",
    header: () => <div className="text-left"># of Athletes</div>,
  },
];
