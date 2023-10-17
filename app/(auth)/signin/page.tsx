import FloatingContainer from "@/components/FloatingContainer";
import LoginForm from "@/app/(auth)/signin/LoginForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <FloatingContainer>
      <h1 className="mt-2 text-center text-xl font-semibold text-brg">Login</h1>

      <LoginForm />

      <div className="mb-1 flex justify-center px-2">
        <p className=" text-sm">
          Forgotten your password?
          <span className="cursor-pointer text-sm text-brg">
            <Link href="/resetPassword"> Click here</Link>
          </span>
        </p>
      </div>
    </FloatingContainer>
  );
};

export default SignIn;
