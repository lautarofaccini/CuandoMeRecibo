"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

function Providers({ children }) {
  return (
    <HeroUIProvider>
      <SessionProvider>{children}</SessionProvider>
    </HeroUIProvider>
  );
}

export default Providers;
