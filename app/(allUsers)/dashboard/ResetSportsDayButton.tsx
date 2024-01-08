"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const ResetEvents = () => {
  const router = useRouter();

  async function resetEvents() {
    let toastId = toast.loading("Resetting Events...");
    try {
      await axios.patch(getURL("/api/update/resetEvents"));

      toast.dismiss(toastId);
      toast.success("Your events have been reset");
      router.refresh();
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div>
      <h4 className="text-xl font-semibold">Reset Events</h4>
      <p>
        To delete all results and remove all athletes from events, click "Reset
        Events" below. This action is not reversible.
      </p>
      <AlertDialog>
        <AlertDialogTrigger className="text-red-600">
          Reset Events
        </AlertDialogTrigger>
        <AlertDialogContent className="w-1/2">
          <AlertDialogTitle className="text-center font-semibold text-2xl">
            Are you sure you want to reset all events?
          </AlertDialogTitle>
          <div className="flex justify-center items-center space-x-2">
            <AlertDialogCancel
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full text-red-600",
              )}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => await resetEvents()}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full text-brg",
              )}
            >
              Confirm
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResetEvents;
