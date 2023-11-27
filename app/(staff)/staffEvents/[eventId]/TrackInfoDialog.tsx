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

const TrackInfoDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <HiOutlineInformationCircle className="h-6 w-6 text-brg" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold">
            Please note:
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            If all of an athlete's time is <b>0</b>, they will not have a result
            recorded, and will therefore recieve no points.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-left">
            If athletes have the same time they will be awarded a draw. If you
            do not want there to be a draw you <b>must</b> give the athletes
            different times.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-left">
            When you press save, any previous results will be deleted before the
            new results are entered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mx-auto w-1/2">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrackInfoDialog;
