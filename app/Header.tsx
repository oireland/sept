"use client";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import HeaderDropdownMenu from "./HeaderDropdownMenu";
import { Skeleton } from "@/components/ui/skeleton";

const Header: FC = () => {
  const session = useSession();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white py-2 shadow-md">
      <Link href="/" className="ml-3">
        <div className="cursor-pointer flex space-x-1 items-center text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-black">SEPT | </span>
          <Trophy className="text-brg h-9 w-auto" />
        </div>
      </Link>

      {session.status === "authenticated" ? (
        <div className="">
          <HeaderDropdownMenu
            userId={session.data.user.userId}
            userRole={session.data.user.role}
          />
        </div>
      ) : session.status === "loading" ? (
        <Skeleton className="w-20 h-8" />
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
