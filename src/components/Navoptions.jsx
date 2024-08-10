"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonNuevo from "./ButtonNuevo";

function Navoptions() {
  const pathname = usePathname();
  return (
    <>
      
        {!(pathname === "/estudiantes") && !pathname.startsWith("/materias") && (
          <li>
            <Link href="/estudiantes" className=" hover:text-sky-400">
              Estudiantes
            </Link>
          </li>
        )}
        {!(pathname === "/materias") && !pathname.startsWith("/estudiantes") && (
          <li>
            <Link href="/materias" className=" hover:text-sky-400">
              Materias
            </Link>
          </li>
        )}
        {(pathname.startsWith("/materias") ||
          pathname.startsWith("/estudiantes")) &&
        !pathname.endsWith("/new") && (
          <li>
            <ButtonNuevo pathname={pathname} />
          </li>
        )}
    </>
  );
}

export default Navoptions;
