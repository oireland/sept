import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const FloatingContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative flex h-screen bg-gray-100">
      <div
        className={cn(
          "mx-auto mt-8 h-fit w-5/6 max-w-lg rounded-md bg-white px-3 py-2 shadow-sm",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

// className="mx-auto mt-8 h-fit w-5/6 max-w-lg rounded-md bg-white px-3 py-2 shadow-sm"

export default FloatingContainer;
