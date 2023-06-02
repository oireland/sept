"use client";

import Banner from "./components/Banner";
import Carousel from "./components/Carousel";

export default function Home() {
  return (
    <div>
      <Banner />

      <div className="mt-3 cursor-default">
        <h1 className="text-xl md:text-2xl lg:text-3xl pl-4 font-semibold mb-3">
          How we help you:
        </h1>
        <Carousel />

        {/* Footer */}
      </div>
    </div>
  );
}
