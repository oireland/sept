"use client";
import FloatingContainer from "@/components/FloatingContainer";
import LoginForm from "@/app/(auth)/signin/LoginForm";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const SignIn = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <FloatingContainer>
      <h1 className="mt-2 text-center text-xl font-semibold text-brg">Login</h1>

      <LoginForm />

      <div className="mb-1 flex justify-center px-2">
        <p className=" text-sm">
          Need to create an account?
          <span className="cursor-pointer text-sm text-brg">
            <Link href="/signup"> Click here</Link>
          </span>
        </p>
      </div>
    </FloatingContainer>
  );
};

export default SignIn;
