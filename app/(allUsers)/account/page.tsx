"use client";

// Importing necessary components and libraries
import LoadingSkeleton from "@/components/LoadingSkeleton";
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
import axios from "axios";
import { useSession } from "next-auth/react";
import Banner from "../../../components/banner";
import AccountForm from "./AccountForm";
import toast from "react-hot-toast";

// Defining the main functional component
const AccountPage = () => {
  // Retrieving user session information
  const session = useSession({ required: true });

  // Function to handle account deletion
  const deleteAccount = async () => {
    // Displaying loading toast while attempting to delete the account
    let toastId = toast.loading("Deleting...");
    try {
      // Making a DELETE request to the server to delete the account
      await axios.delete(
        getURL(`/api/delete/deleteOwnAccount/${session.data?.user.userId}`),
      );
      // Dismissing the loading toast and displaying a success toast
      toast.dismiss(toastId);
      toastId = toast.success("Account deleted");
    } catch (e) {
      // Dismissing the loading toast and displaying an error toast on failure
      toast.dismiss(toastId);
      toast.error("Couldn't delete your account.");
    }
  };

  // Rendering content based on user session status
  if (session.status === "authenticated") {
    return (
      <div>
        {/* Displaying a banner with the text "My Account" */}
        <Banner text="My Account" />

        <div className="container mt-2">
          <h2 className="text-xl font-semibold">Update Account Details</h2>

          {/* Rendering the AccountForm component with initial values */}
          <AccountForm
            initialValues={{
              email: session.data!.user.email,
              name: session.data!.user.name,
              newPassword: "",
              newPasswordRepeat: "",
              oldPassword: "",
            }}
          />

          {/* Horizontal line separator */}
          <hr className="w-full h-1" />

          {/* Displaying content for users with the "HOST" role */}
          {session.data.user.role === "HOST" && (
            <div>
              <h4 className="text-xl font-semibold">Delete account</h4>
              <p>
                To delete your account and associated data, click "Delete my
                account" below. This action is not reversible.
              </p>
              {/* Displaying an AlertDialog for confirmation */}
              <AlertDialog>
                <AlertDialogTrigger className="text-red-600">
                  Delete my account
                </AlertDialogTrigger>
                <AlertDialogContent className="w-1/2">
                  <AlertDialogTitle className="text-center font-semibold text-2xl">
                    Are you sure you want to delete your account?
                  </AlertDialogTitle>
                  <div className="flex justify-center items-center space-x-2">
                    {/* Cancel button */}
                    <AlertDialogCancel
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full text-red-600",
                      )}
                    >
                      Cancel
                    </AlertDialogCancel>
                    {/* Confirm button triggering the deleteAccount function */}
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

  // Displaying a loading skeleton if the user is not authenticated
  return <LoadingSkeleton />;
};

// Exporting the AccountPage component as the default export
export default AccountPage;
