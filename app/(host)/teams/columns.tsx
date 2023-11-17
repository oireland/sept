"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type TeamsTableData = {
  teamName: string;
  numberOfAthletes: number;
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
  },
  {
    accessorKey: "numberOfAthletes",
    id: "# of Athletes",
    header: () => <div className="text-left"># of Athletes</div>,
  },
];
