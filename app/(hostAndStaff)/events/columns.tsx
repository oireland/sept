"use client";

import { BoyOrGirl, EventType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import getURL from "@/lib/getURL";
import Link from "next/link";

export type EventTableData = {
  name: string;
  groupName: string;
  eventType: EventType;
  boyOrGirl: BoyOrGirl;
  eventId: string;
  numberOfAthletes: number;
  staffName?: string;
  maxNumberOfAthletes: number;
  locationName: string;
  date: Date;
};

export const columns: ColumnDef<EventTableData>[] = [
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
    id: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm text-black"
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-sm text-black"
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
    header: () => <div>Boy/Girl</div>,
  },
  {
    accessorKey: "eventType",
    id: "Event Type",
    header: () => <div>Event Type</div>,
  },
  {
    accessorKey: "numberOfAthletes",
    id: "Number of Athletes",
    header: () => <div># Athletes</div>,
    cell({ row }) {
      return (
        <div>
          {row.original.numberOfAthletes}/{row.original.maxNumberOfAthletes}
        </div>
      );
    },
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
    accessorKey: "date",
    id: "Time",
    header: () => <div>Time</div>,
    cell: ({ row }) => {
      let date = row.original.date;
      return <div>{date.toLocaleTimeString().slice(0, -3)}</div>;
    },
  },
  {
    accessorKey: "staffName",
    id: "Staff",
    header: () => <div>Staff</div>,
    cell: ({ row }) => {
      const { staffName } = row.original;
      if (staffName) {
        return <div>{staffName}</div>;
      } else {
        return <X className="mx-2 h-4 w-4" />;
      }
    },
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const { eventId } = row.original;

      return (
        <div className="mx-auto flex items-center">
          <Link href={getURL(`/events/${eventId}`)}>
            <Edit className="h-5 w-5" />
          </Link>
        </div>
      );
    },
    enableHiding: false,
  },
];

export const columnsAthleteView = columns.slice(0, -2);
