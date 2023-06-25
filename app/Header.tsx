"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Header: FC = () => {
  const pathname = usePathname();
  // below code is just for logging the session no matter the page
  // const session = useSession();
  // console.log(session);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-3 py-2 shadow-md">
      <Link href="/">
        <h1 className="cursor-pointer text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-brg">7 </span> | SEPT
        </h1>
      </Link>

      {/* Only show the login and sign up buttons if on the homescreen */}
      {pathname === "/" && (
        <div>
          <Link
            href="/signin"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brg opacity-75 duration-150 hover:opacity-100 md:text-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full border bg-white  px-4 py-2 text-sm font-semibold text-brg opacity-75 duration-150 hover:opacity-100 md:text-lg"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
