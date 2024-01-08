"use client";

import { Switch } from "@/components/ui/switch";
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
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col">
        <h4 className="text-xl font-semibold">Allow Athlete Self-Signup</h4>

        <label className="text-lg">
          Toggle the permission for athlete's to sign themselves up for events.
          We recommend turning off this permission close to the Sports Day, to
          finalise the compeititors.
        </label>
        <Switch
          onCheckedChange={toggleAthleteSignupPermission}
          checked={isToggled}
          className="data-[state=checked]:bg-brg data-[state=unchecked]:bg-red-500"
        />
      </div>
    </div>
  );
};

export default AthleteSignupPermissionToggle;
