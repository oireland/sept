"use client";

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

import getURL from "@/lib/getURL";
import Link from "next/link";
import { EventTableData } from "../../(hostAndStaff)/events/columns";

export const columns: ColumnDef<EventTableData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "group",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Group
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "boyOrGirl",
    id: "Boy/Girl",
    header: () => <div className="text-left">Boy/Girl</div>,
  },
  {
    accessorKey: "eventType",
    id: "Track/Field",
    header: () => <div className="text-left">Track/Field</div>,
  },
  {
    accessorKey: "numberOfAthletes",
    id: "Number of Athletes",
    header: () => <div className="text-left"># Athletes</div>,
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const { id } = row.original;

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
                href={getURL(`/events/${id}`)}
                className="h-full  w-full px-2 py-1.5 "
              >
                View/Edit Competitors
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="h-full  w-full px-2 py-1.5 "
                href={getURL(`/staffEvents/${id}`)}
              >
                Results
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
