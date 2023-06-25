"use client";

import Hero from "./homeSections/Hero";
import Benefits from "./homeSections/Benefits";
import Carousel from "./homeSections/Carousel";

export default function Home() {
  return (
    <main>
      <Hero />
      <Carousel />
      <Benefits />
    </main>
  );
}
