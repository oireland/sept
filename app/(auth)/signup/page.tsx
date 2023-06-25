"use client";
import SignUpForm from "@/components/SignUpForm";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

const SignUp = () => {
  const [role, setRole] = useState<UserRole>(UserRole.HOST);
  const [showRoleOptions, setShowRoleOptions] = useState<boolean>(false);
  return (
    <div className="relative flex h-screen">
      <div className="mx-auto mt-8 h-fit w-5/6 max-w-lg rounded-md bg-platinum shadow-lg">
        <div className="mt-2 flex items-center justify-center">
          <h1 className="text-center text-xl font-semibold text-black">
            Sign Up as a&nbsp;
          </h1>

          <div className="relative cursor-pointer">
            <div
              className="flex"
              onClick={() => setShowRoleOptions(!showRoleOptions)}
            >
              <h1 className="text-center text-xl font-semibold text-black underline decoration-brg">
                {role === "HOST" ? "Host" : "Spectator"}
              </h1>
              <p className=" rotate-90 text-xs font-semibold text-brg">
                {"<>"}
              </p>
            </div>
            {showRoleOptions && (
              <div
                className="absolute w-full min-w-fit rounded-md bg-white px-1  text-lg font-semibold text-black decoration-brg shadow-md hover:underline"
                onClick={() => {
                  setRole(
                    role === UserRole.HOST ? UserRole.SPECTATOR : UserRole.HOST
                  );
                  setShowRoleOptions(!showRoleOptions);
                }}
              >
                {role === UserRole.HOST ? "Spectator" : "Host"}
              </div>
            )}
          </div>
        </div>

        <SignUpForm role={role} />

        <div className="mb-1 flex justify-center px-2">
          <p className=" text-sm">
            Already have an account?
            <span className="cursor-pointer text-sm text-brg">
              <Link href="/signin"> Click here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
