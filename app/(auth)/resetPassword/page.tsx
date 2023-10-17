"use client";
import FloatingContainer from "@/components/FloatingContainer";
import React, { useState } from "react";
import ForgottenPasswordForm from "./ForgottenPasswordForm";

const ForgottenPasswordPage = () => {
  const [isSent, setIsSent] = useState(false);

  return (
    <div>
      <FloatingContainer>
        <h1 className="mt-2 text-center text-2xl font-semibold text-brg lg:text-3xl">
          Forgot Password
        </h1>

        {!isSent ? (
          <>
            <h2 className="mx-auto mt-2 w-2/3 text-center text-sm lg:text-base">
              Enter your email address below to recieve a link to reset your
              account password
            </h2>

            <ForgottenPasswordForm setIsSent={setIsSent} />
          </>
        ) : (
          <div className="my-3 flex flex-col items-center space-y-3">
            <h2 className="mx-auto w-2/3 text-center text-base">
              Check your email
            </h2>
            <h2 className="mx-auto w-2/3 text-center text-base">
              If an account was found for the email provided then you should
              recieve an email shortly.
            </h2>
            <h2 className="mx-auto w-2/3 text-center text-base">
              Click the link within the email to reset your password.
            </h2>
          </div>
        )}
      </FloatingContainer>
    </div>
  );
};

export default ForgottenPasswordPage;
