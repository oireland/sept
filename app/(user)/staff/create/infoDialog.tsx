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
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl font-semibold">
            How to sign up staff
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Your staff's data should be in rows in a spreadsheet with 2 columns
            in the exact order: Name, Email
            <br />
            For example:
          </AlertDialogDescription>
          <Table className="mx-auto max-w-fit text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Mr John Smith</TableCell>
                <TableCell>jsmith@school.co.uk</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mrs Julia Andrews</TableCell>
                <TableCell>17jsmith@school.co.uk</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mr Michael Williams</TableCell>
                <TableCell>mwilliams@school.co.uk</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <AlertDialogDescription className="text-left">
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
            Once the file has been uploaded the number of staff that have been
            found when processing the file will be displayed.
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
