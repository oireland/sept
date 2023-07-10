"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import Link from "next/link";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-brg">There was a problem</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {error.message || "Something went wrong"}
        </h1>
        <p className="mt-6 text-base leading-7 text-zinc-600">
          Please try again later
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={reset}>Try again</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default error;
