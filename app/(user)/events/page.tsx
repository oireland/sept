import React from "react";
import Banner from "../banner";

import events from "@/app/assets/images/events.svg";

const Events = () => {
  return (
    <div>
      <Banner src={events} alt="" text="Your Events" />
    </div>
  );
};

export default Events;
