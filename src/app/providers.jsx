"use client";

import { HeroUIProvider } from "@heroui/react";


function Providers({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default Providers;