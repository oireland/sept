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

const HighJumpInfoDialog = () => {
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
            How to enter results for High Jump or Pole Valut:
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <ul>
              <li>
                Enter the height for each round at the top of a column. If you
                need to add another height press the plus button to the right of
                the "Height" column header.
              </li>
              <li>
                Each athlete has 3 attempts at each height. Click once to change
                an attempt to a success, click again for a fail, click a third
                time if the athlete has "passed" the height.
              </li>
              <li>
                An athlete is out of the competition after 3 consecutive failed
                attempts - passing a height does not break a streak of failed
                attempts.
              </li>
              <li>Repeat for every round.</li>
            </ul>
          </AlertDialogDescription>
          <AlertDialogDescription className="text-left">
            If two or more jumpers tie for the top spot (all remaining athletes
            fail to clear a particular height), the factors which act as the
            tie-breaker between them are as follows in order of priority:
            <ol>
              <li>
                The fewest failed attempts at the height at which the tie
                occurred
              </li>
              <li>The fewest failed attempts throughout the competition</li>
            </ol>
            If there's still no clear winner, a jump off takes place to
            determine the winner, where jumpers get one opportunity to clear the
            next height mark. The crossbar is then alternately lowered and
            raised until only one jumper succeeds. In the event of a jump off
            the athletes involved will be shown for you to select the winner, or
            the athletes can choose to "share the gold"
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

export default HighJumpInfoDialog;
