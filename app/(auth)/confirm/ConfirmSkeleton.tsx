import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ConfirmSkeleton = () => {
  return (
    <div className="space-y-3 px-1 py-2">
      <Skeleton className="mx-auto h-[20px] w-[200px] " />
      <Skeleton className="mx-auto h-10 w-10" />
      <div className="space-y-1">
        <Skeleton className="mx-auto h-[15px] w-[250px]" />
        <Skeleton className="mx-auto h-[15px] w-[150px]" />
      </div>

      <div className="space-y-1">
        <Skeleton className="mx-auto h-[15px] w-[350px] max-w-full" />
        <Skeleton className="mx-auto h-[15px] w-[350px] max-w-full" />
      </div>

      <Skeleton className="mx-auto h-[10px] w-[100px] " />
      <Skeleton className="mx-auto h-[30px] w-[100px]" />
    </div>
  );
};

export default ConfirmSkeleton;
