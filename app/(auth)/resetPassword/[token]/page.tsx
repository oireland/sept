import FloatingContainer from "@/components/FloatingContainer";
import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";

const Reset = ({ params }: { params: { token: string } }) => {
  return (
    <div>
      <FloatingContainer>
        <h1 className="mt-2 text-center text-xl font-semibold text-brg">
          Reset Password
        </h1>

        <ResetPasswordForm token={params.token} />
      </FloatingContainer>
    </div>
  );
};

export default Reset;
