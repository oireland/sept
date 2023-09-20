"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { IoExitOutline } from "react-icons/io5";
import { HiBars3 } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/skeleton";

const Header: FC = () => {
  const pathname = usePathname();
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-3 py-2 shadow-md">
      <Link href={session.status === "authenticated" ? "/dashboard" : "/"}>
        <h1 className="cursor-pointer text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-brg">7 </span> | SEPT
        </h1>
      </Link>

      {/* Only show the login and sign up buttons if on the homescreen */}

      {session.status === "authenticated" ? (
        <div>
          <HiBars3 className="peer relative h-9 w-9 text-gray-700" />
          <div className="absolute right-0 hidden rounded-b-lg pt-3 hover:inline-block peer-hover:inline-block">
            <div
              onClick={() => signOut()}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 hover:bg-gray-200"
            >
              <h6>Sign Out</h6>
              <IoExitOutline />
            </div>
          </div>
          <p></p>
        </div>
      ) : pathname === "/" && session.status === "unauthenticated" ? (
        <div>
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
      ) : (
        <Skeleton className="h-8 w-20" />
      )}
    </header>
  );
};

export default Header;
