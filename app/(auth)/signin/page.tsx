"use client";
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="relative flex h-screen">
      <div className="mx-auto mt-8 h-fit w-5/6 max-w-lg rounded-md bg-platinum shadow-lg">
        <h1 className="mt-2 text-center text-xl font-semibold text-brg">
          Login
        </h1>

        <LoginForm />

        <div className="mb-1 flex justify-center px-2">
          <p className=" text-sm">
            Need to create an account?
            <span className="cursor-pointer text-sm text-brg">
              <Link href="/signup"> Click here</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
