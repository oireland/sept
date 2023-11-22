"use client";

import { Checkbox } from "@/components/ui/checkbox";
import getURL from "@/lib/getURL";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const AthleteSignupPermissionToggle = ({
  isToggled,
}: {
  isToggled: boolean;
}) => {
  const router = useRouter();
  async function toggleAthleteSignupPermission(checked: boolean) {
    let toastId = toast.loading("Updating...");
    try {
      await axios.patch(getURL("/api/update/toggleAthleteSignupPermission"), {
        isAllowed: checked,
      });
      toast.dismiss(toastId);
      toast.success("Updated!");
      router.refresh();
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toast.error(e.response?.data);
      }
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <label htmlFor="athleteSignupPermission" className="text-lg">
          Allow athletes to sign themselves up for events
        </label>
        <Checkbox
          onCheckedChange={toggleAthleteSignupPermission}
          checked={isToggled}
          className="w-5 h-5"
          id="athleteSignupPermission"
        />
      </div>
    </div>
  );
};

export default AthleteSignupPermissionToggle;
