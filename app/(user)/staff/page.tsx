import React from "react";
import Banner from "../banner";

import staff from "@/app/assets/images/staff.svg";

const Staff = () => {
  return (
    <div>
      <Banner text="Your Staff" src={staff} alt="" />
    </div>
  );
};

export default Staff;
