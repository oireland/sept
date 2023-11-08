import FloatingContainer from "@/components/FloatingContainer";
import SignUpForm from "@/app/(auth)/signup/SignUpForm";
import Link from "next/link";

const SignUp = () => {
  return (
    <FloatingContainer>
      <div>
        <div className="mt-2 flex items-center justify-center">
          <h1 className="mt-2 text-center text-xl font-semibold text-brg">
            Sign Up
          </h1>
        </div>
      </div>

      <SignUpForm />

      <div className="mb-1 flex justify-center px-2">
        <p className=" text-sm">
          Already have an account?
          <span className="cursor-pointer text-sm text-brg">
            <Link href="/signin"> Click here</Link>
          </span>
        </p>
      </div>
    </FloatingContainer>
  );
};

export default SignUp;
