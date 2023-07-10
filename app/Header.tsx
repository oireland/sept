"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header: FC = () => {
  const pathname = usePathname();

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
            <Button variant={"ghost"} size={"lg"} className="">
              Login
            </Button>
          </Link>
          <Link
            href="/signup"
            // className={buttonVariants({ variant: "outline" })}
          >
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
