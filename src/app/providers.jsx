"use client";

import { NextUIProvider } from "@nextui-org/react";


function Providers({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

export default Providers;