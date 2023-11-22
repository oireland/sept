import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

const InfoDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <HiOutlineInformationCircle className="h-6 w-6 text-brg" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-xl overflow-x-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold">
            How to sign up athletes
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left text-xs">
            Your athlete's data should be in rows in a spreadsheet with the
            columns in the exact order: Name, Email, Year Group, Team, BOY/GIRL.
            <br />
            For example:
          </AlertDialogDescription>
          <Table className="mx-auto max-w-fit overflow-x-scroll text-xs">
            <TableHeader>
              <TableRow>
                <TableHead className="px-2">Name</TableHead>
                <TableHead className="px-2">Email</TableHead>
                <TableHead className="px-2">Year Group</TableHead>
                <TableHead className="px-2">Team</TableHead>
                <TableHead className="px-2">BOY/GIRL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="px-1">John Smith</TableCell>
                <TableCell className="px-1">12jsmith@school.co.uk</TableCell>
                <TableCell className="px-1">Sixth Form</TableCell>
                <TableCell className="px-1">Red</TableCell>
                <TableCell className="px-1">BOY</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="px-1">Julia Andrews</TableCell>
                <TableCell className="px-1">17jsmith@school.co.uk</TableCell>
                <TableCell className="px-1">Year 7</TableCell>
                <TableCell className="px-1">Blue</TableCell>
                <TableCell className="px-1">GIRL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="px-1">Michael Williams</TableCell>
                <TableCell className="px-1">14mwilliams@school.co.uk</TableCell>
                <TableCell className="px-1">Year 10</TableCell>
                <TableCell className="px-1">Yellow</TableCell>
                <TableCell className="px-1">BOY</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <AlertDialogDescription className="text-left text-xs">
            The groups and teams must match one of the groups/teams you have
            added.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-left text-xs">
            Export the spreadsheet to a{" "}
            <a
              className="font-semibold underline"
              href="https://support.microsoft.com/en-au/office/import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba#:~:text=Save%20As%20command.-,Go%20to%20File%20%3E%20Save%20As.,or%20CSV%20(Comma%20delimited)."
              target="_blank"
            >
              .csv
            </a>{" "}
            file and upload the file.
            <br />
            Once the file has been uploaded the number of athletes in the file
            will be displayed.
            <br />
            You <b>must</b> make sure that these details are correct before you
            press submit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mx-auto w-1/2">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InfoDialog;
