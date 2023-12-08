import FloatingContainer from "@/components/FloatingContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import * as json2csv from "json2csv";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateRecordsForm from "./CreateRecordsForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const getEventData = async (userId: string) => {
  try {
    const eventData = await prisma.event.findMany({
      where: {
        host: {
          userId,
        },
      },
      select: {
        eventId: true,
        recordHolderName: true,
        yearRecordSet: true,
        recordScore: true,
        name: true,
        groupName: true,
        athletesBoyOrGirl: true,
      },
    });

    return eventData.map(
      ({
        eventId,
        athletesBoyOrGirl,
        groupName,
        name,
        recordHolderName,
        yearRecordSet,
        recordScore,
      }) => ({
        eventId,
        eventName: `${groupName} ${
          athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
        } ${name}`,
        recordHolderName: recordHolderName || "",
        yearRecordSet: yearRecordSet || "",
        recordScore: recordScore || "",
      }),
    );
  } catch (e) {
    console.log(e);
    return [];
  }
};

const CreateRecordsPage = async () => {
  const session = await getServerSession();

  const eventData = await getEventData(session!.user.userId);

  const csvData = json2csv.parse(eventData);

  return (
    <FloatingContainer className="space-y-4 p-4">
      <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
        Add Records
      </h2>
      <div className="w-full space-y-2">
        <h3 className="text-left text-lg">
          Firstly, download the template CSV file below:
        </h3>
        <div className="flex items-center justify-center w-full">
          <Button variant={"outline"} asChild className="w-full">
            <a
              href={`data:text/csv;charset=utf-8,${csvData}`}
              download="recordsTemplate"
            >
              Download Template CSV
            </a>
          </Button>
        </div>
      </div>
      <div className="w-full space-y-2">
        Enter the name of the record holder, and the year in which the record
        was set for each event.
        <br />
        The format of the file should be the following (The first two columns
        are pre-filled):
        <Table className="mx-auto overflow-x-scroll text-xs">
          <TableHeader>
            <TableRow>
              <TableHead className="px-2">EventId</TableHead>
              <TableHead className="px-2">Event Name</TableHead>
              <TableHead className="px-2">Record holder name</TableHead>
              <TableHead className="px-2">Year record set</TableHead>
              <TableHead className="px-2">Record Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="px-1">wecij2bnc2icxn2jicx</TableCell>
              <TableCell className="px-1">Year 7 Boy's Javelin</TableCell>
              <TableCell className="px-1">Michael Williams</TableCell>
              <TableCell className="px-1">2014</TableCell>
              <TableCell className="px-1">31.5</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-1">2udoib2ncjowenqco2uc</TableCell>
              <TableCell className="px-1">Year 8 Girls's Shotput</TableCell>
              <TableCell className="px-1">Michelle Watson</TableCell>
              <TableCell className="px-1">2018</TableCell>
              <TableCell className="px-1">8.9</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="px-1">2cih2cweci2cbn23c</TableCell>
              <TableCell className="px-1">Year 10 Boy's 100m</TableCell>
              <TableCell className="px-1">Mark Wetherspoon</TableCell>
              <TableCell className="px-1">2020</TableCell>
              <TableCell className="px-1">10.98</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="w-full space-y-2">
        <h3 className="text-left text-lg">
          Finally, upload the completed CSV file below:
        </h3>
        <CreateRecordsForm
          allowedEventIds={eventData.map(({ eventId }) => eventId)}
        />
      </div>
    </FloatingContainer>
  );
};

export default CreateRecordsPage;
