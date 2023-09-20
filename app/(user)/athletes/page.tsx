import React from "react";
import Banner from "../banner";

import athlete from "@/app/assets/images/athlete.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Athletes = () => {
  return (
    <div>
      <Banner text="Your Athletes" src={athlete} alt="" />
      <Button variant={"outline"}>
        <Link href={"/athletes/create"}>Add new athletes</Link>
      </Button>
    </div>
  );
};

export default Athletes;
