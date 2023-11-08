"use client";

import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const ClearResultsButton = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  async function deleteResults() {
    let toastId = toast.loading("Resetting...");
    try {
      await axios.delete(getURL(`/api/delete/deleteEventsResults/${eventId}`));

      toast.dismiss();
      toastId = toast.success("Results have been reset");
      router.refresh();
    } catch (e) {
      toast.dismiss();
      toastId = toast.error("Something went wrong");
    }
  }

  return (
    <Button onClick={deleteResults} variant={"form"}>
      Reset
    </Button>
  );
};

export default ClearResultsButton;
