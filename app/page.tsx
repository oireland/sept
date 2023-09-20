"use client";

import Hero from "./homeSections/Hero";
import Benefits from "./homeSections/Benefits";
import Carousel from "./homeSections/Carousel";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect the user to their dashboard if they are already signed in
  const session = useSession();
  if (session.status === "authenticated") {
    redirect("/dashboard");
  }
  return (
    <main>
      <Hero />
      <Carousel />
      <Benefits />
    </main>
  );
}
