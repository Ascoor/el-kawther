import React, { useState } from "react";
import HomePage from "./HomePage";
import { BrandSplashLoader } from "@/components/loaders/BrandSplashLoader";

export default function HomeWithSplash() {
  const [done, setDone] = useState(false);

  return (
    <>
      {!done && <BrandSplashLoader auto onDone={() => setDone(true)} />}
      {done && <HomePage />}
    </>
  );
}
