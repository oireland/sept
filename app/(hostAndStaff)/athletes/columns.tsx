"use client";

import { BoyOrGirl } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import getURL from "@/lib/getURL";

export type AthleteTableData = {
  userId: string;
  name: string;
  email: string;
  groupName: string;
  teamName: string;
  numberOfEvents: number;
  boyOrGirl: BoyOrGirl;
};

export const columns: ColumnDef<AthleteTableData>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "groupName",
    id: "Group",
    header: () => <div className="text-left">Group</div>,
  },
  {
    accessorKey: "teamName",
    id: "Team",
    header: () => <div className="text-left">Team</div>,
  },
  {
    accessorKey: "boyOrGirl",
    id: "Boy/Girl",
    header: () => <div className="text-left">Boy/Girl</div>,
  },
  {
    accessorKey: "numberOfEvents",
    id: "Number of Events",
    header: () => <div className="text-left"># Events</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { userId, email } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Link
                className="h-full  w-full px-2 py-1.5 "
                href={getURL(`/athletes/${userId}`)}
              >
                View/Edit Events
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="h-full  w-full px-2 py-1.5 "
                href={getURL(`/results/${userId}`)}
              >
                View Results
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(email)}
            >
              Copy email address
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
