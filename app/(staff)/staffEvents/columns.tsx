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
    accessorKey: "eventFullName",
    id: "Event Name",
    header() {
      return <h2 className="text-sm">Event</h2>;
    },
  },
  {
    accessorKey: "numberOfAthletes",
    id: "Number of Athletes",
    header: () => <div className="text-left"># Athletes</div>,
  },
  {
    accessorKey: "locationName",
    id: "Location",
    header: () => <div>Location</div>,
  },
  {
    accessorKey: "date",
    id: "Date",
    header: () => <div>Date</div>,
    cell: ({ row }) => {
      let date = row.original.date;

      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "recordString",
    id: "Record",
    header: () => <div>Record</div>,
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const { eventId } = row.original;

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
                href={getURL(`/events/${eventId}`)}
                className="h-full  w-full px-2 py-1.5 "
              >
                View/Edit Competitors
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                className="h-full  w-full px-2 py-1.5 "
                href={getURL(`/staffEvents/${eventId}`)}
              >
                View/Enter Results
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
  },
];
