"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonNuevo from "./ButtonNuevo";

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-zinc-950 text-white py-3 mb-2">
      <div className="container mx-auto flex items-center justify-between">
        <h3 className="font-bold text-3xl  text-sky-100 hover:text-white">
          <Link href="/">Cuando Me Recibo?</Link>
        </h3>
        <ul className="flex gap-x-4 text-2xl font-bold text-sky-500">
          {!(pathname === "/estudiantes") &&
          !pathname.startsWith("/materias") ? (
            <li>
              <Link href="/estudiantes" className=" hover:text-sky-400">
                Estudiantes
              </Link>
            </li>
          ) : null}
          {!(pathname === "/materias") &&
          !pathname.startsWith("/estudiantes") ? (
            <li>
              <Link href="/materias" className=" hover:text-sky-400">
                Materias
              </Link>
            </li>
          ) : null}
          {(pathname.startsWith("/materias") ||
            pathname.startsWith("/estudiantes")) &&
          !pathname.endsWith("/new") ? (
            <li>
              <ButtonNuevo pathname={pathname} />
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
