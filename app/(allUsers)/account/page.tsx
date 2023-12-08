"use client";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";
import Banner from "../../../components/banner";
import AccountForm from "./AccountForm";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import getURL from "@/lib/getURL";

const AccountPage = () => {
  const session = useSession({ required: true });

  const deleteAccount = async () => {
    try {
      await axios.delete(
        getURL(`/api/delete/deleteOwnAccount/${session.data?.user.userId}`),
      );
    } catch (e) {
      console.log(e);
    }
  };

  if (session.status === "authenticated") {
    return (
      <div>
        <Banner text="My Account" />

        <div className="container mt-2">
          <h2 className="text-xl font-semibold">Update Account Details</h2>

          <AccountForm
            initialValues={{
              email: session.data!.user.email,
              name: session.data!.user.name,
              newPassword: "",
              newPasswordRepeat: "",
              oldPassword: "",
            }}
          />

          <hr className="w-full h-1" />

          {session.data.user.role === "HOST" && (
            <div>
              <h4 className="text-xl font-semibold">Delete account</h4>
              <p>
                To delete your account and associated data, click "Delete my
                account" below. This action is not reversible.
              </p>
              <AlertDialog>
                <AlertDialogTrigger className="text-red-600">
                  Delete my account
                </AlertDialogTrigger>
                <AlertDialogContent className="w-1/2">
                  <AlertDialogTitle className="text-center font-semibold text-2xl">
                    Are you sure you want to delete your account?
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
                      onClick={async () => await deleteAccount()}
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
          )}
        </div>
      </div>
    );
  }

  return <LoadingSkeleton />;
};

export default AccountPage;
