"use client";
import FloatingContainer from "@/components/FloatingContainer";
import { Button } from "@/components/ui/button";
import { VerificationToken } from "@/lib/token";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import ConfirmSkeleton from "./ConfirmSkeleton";
import getURL from "@/lib/getURL";

const Confirm: FC = () => {
  const [lastSend, setLastSend] = useState(new Date());
  const timeBetweenSends = 30000; // 30 seconds for testing, increase to 10-15 minutes maybe

  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  useEffect(() => {
    if (session.data?.user.emailVerified) redirect("/dashboard");
  }, [session]);

  const email = session.data?.user.email || null;
  const userId = session.data?.user.email || null;
  const userRole = session.data?.user.role || null;

  const canSendEmail = () => {
    const difference = new Date().getTime() - lastSend.getTime();
    return difference > timeBetweenSends;
  };

  const resendEmail = async () => {
    if (canSendEmail()) {
      let toastId = toast.loading("Resending email...");
      try {
        if (userRole === "HOST") {
          const tokenData: VerificationToken = {
            email: email!,
            userId: userId!,
          };
          await axios.post(
            getURL("/api/auth/sendVerificationEmail"),
            tokenData,
          );
        } else {
          await axios.post(getURL("/api/auth/sendPasswordResetEmail"), {
            email,
          });
        }
        toast.dismiss(toastId);
        toastId = toast.success("Email has been sent");
        setLastSend(new Date());
      } catch (e) {
        console.log(e);
        toastId = toast.error("An error has occurred");
      }
    } else {
      toast.error("Please wait before sending another email");
    }
  };

  return (
    <FloatingContainer>
      {session.status === "loading" ? (
        <ConfirmSkeleton />
      ) : (
        <div className="space-y-3 py-2 text-center text-sm sm:text-base">
          <h2 className="text-base font-semibold sm:text-xl">
            Please verify your email
          </h2>
          <FaPaperPlane className="mx-auto h-10 w-10" />
          <p className="">
            You're almost there! We sent an email to
            <br />
            <b>{email}</b>
          </p>
          <p>
            Just click on the link in that email to complete your signup. <br />
            If you don't see it, you may need to check your spam folder.
          </p>
          <p className="text-xs">Still can't find the email?</p>
          <Button variant={"form"} onClick={resendEmail}>
            Resend Email
          </Button>
        </div>
      )}
    </FloatingContainer>
  );
};

export default Confirm;
