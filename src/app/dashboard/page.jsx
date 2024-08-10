"use client"
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";

function DashboardPage() {
  return (
    <section className="h-[calc(100hv-7rem)] flex justify-center items-center">
      <h1 className="text-white text-5xl">Dashboard</h1>
      <Button onClick={() => signOut()}>Cerrar Sesión</Button>
    </section>
  );
}

export default DashboardPage;
