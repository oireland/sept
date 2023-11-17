"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

export type GroupsTableData = {
  groupName: string;
  numberOfAthletes: number;
};

export const columns: ColumnDef<GroupsTableData>[] = [
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
    accessorKey: "groupName",
    id: "Group",
    header: () => <div className="text-left">Group</div>,
  },
  {
    accessorKey: "numberOfAthletes",
    id: "# of Athletes",
    header: () => <div className="text-left"># of Athletes</div>,
  },
];
