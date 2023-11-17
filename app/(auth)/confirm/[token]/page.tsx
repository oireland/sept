import React from "react";
import axios from "axios";
import getURL from "@/lib/getURL";
import FloatingContainer from "@/components/FloatingContainer";
import { IconType } from "react-icons";
import { GiConfirmed } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Confirm = async ({ params }: { params: { token: string } }) => {
  try {
    await axios.patch(getURL("/api/auth/verifyUser"), {
      token: params.token,
    });
    return (
      <FloatingContainer className="text-center">
        <GiConfirmed className="mx-auto h-12 w-12 text-brg" />
        <h2>Success!</h2>
        <p>
          Your email has been confirmed, you can close this window and finish
          setting up your account.
        </p>
      </FloatingContainer>
    );
  } catch (e) {
    return (
      <FloatingContainer className="text-center">
        <BiErrorCircle className="mx-auto h-12 w-12 text-red-600" />
        <h2>Oops...</h2>
        <p>Something went wrong so we couldn't verify your email.</p>
        <p>Please login and we will send you another email!</p>
        <Link href="/signin">
          <Button variant={"outline"} className="text-red-600">
            Login
          </Button>
        </Link>
      </FloatingContainer>
    );
  }
};

export default Confirm;
