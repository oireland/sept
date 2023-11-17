import LoadingSkeleton from "@/components/LoadingSkeleton";
import Banner from "@/components/banner";
import React from "react";

const loading = () => {
  return (
    <div>
      <Banner text="Teams" />
      <LoadingSkeleton />
    </div>
  );
};

export default loading;
