"use client";
import { FC } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { HiBars3 } from "react-icons/hi2";
import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: FC = () => {
  const pathname = usePathname();
  const session = useSession();
  const userRole = session.data?.user.role;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-3 py-2 shadow-md">
      <Link href="/">
        <h1 className="cursor-pointer text-xl font-semibold md:text-2xl lg:text-3xl xl:text-4xl">
          <span className="text-brg">7 </span> | SEPT
        </h1>
      </Link>

      {session.status === "authenticated" ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiBars3 className="h-9 w-9 text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="p-0">
                <Link href="/dashboard" className="h-full w-full px-2 py-1.5  ">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/athletes" className="h-full w-full px-2 py-1.5 ">
                  Athletes
                </Link>
              </DropdownMenuItem>
              {userRole === "HOST" && (
                <DropdownMenuItem className="p-0">
                  <Link href="/staff" className="h-full  w-full px-2 py-1.5 ">
                    Staff
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="p-0">
                <Link href="/events" className="h-full  w-full px-2 py-1.5 ">
                  Events
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <h6>Sign Out</h6>
                  <LogOutIcon className="h-4 w-4" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        pathname === "/" && (
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
        )
      )}
    </header>
  );
};

export default Header;
