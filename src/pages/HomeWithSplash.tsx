import React, { useState } from "react";
import HomePage from "./HomePage";
import { SplashScreen } from "@/components/layout/SplashScreen";

export default function HomeWithSplash() {
  const [done, setDone] = useState(false);

  return (
    <>
      <HomePage />
      {!done && <SplashScreen onDone={() => setDone(true)} skipIfSeen />}
    </>
  );
}
