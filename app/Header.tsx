"use client";
import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import getURL from "@/lib/getURL";

const Header: FC = () => {
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white py-2 shadow-md">
      <Link href="/" className="ml-3">
        <h1 className="cursor-pointer text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-brg">7 </span> | SEPT
        </h1>
      </Link>

      {session.status === "authenticated" ? (
        <div className="">
          <HeaderDropdownMenu
            userId={session.data.user.userId}
            userRole={session.data.user.role}
          />
        </div>
      ) : session.status === "loading" ? (
        <div></div>
      ) : (
        <div className="pr-3">
          <Link href="/signin">
            <Button variant={"ghost"} size={"lg"} className="">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant={"outline"} size={"lg"} className="">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
