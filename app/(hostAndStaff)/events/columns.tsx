"use client";

import { BoyOrGirl, EventType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import getURL from "@/lib/getURL";
import Link from "next/link";

export type EventTableData = {
  eventFullName: string;
  eventId: string;
  numberOfAthletes: number;
  staffName?: string;
  maxNumberOfAthletes: number;
  locationName: string;
  date: Date;
  recordString: string;
  boyOrGirl: BoyOrGirl;
  groupName: string;
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
    accessorKey: "eventFullName",
    id: "Event Name",
    header() {
      return <h2 className="text-sm">Event</h2>;
    },
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
    accessorKey: "recordString",
    id: "Record",
    header: () => <div>Record</div>,
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
