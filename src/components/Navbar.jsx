import Link from "next/link";
import Navoptions from "@/components/Navoptions";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="bg-zinc-950 text-white py-3 mb-2">
      <div className="container mx-auto flex items-center justify-between">
        <h3 className="font-bold text-3xl  text-sky-100 hover:text-white">
          <Link href="/">Cuando Me Recibo?</Link>
        </h3>
        <ul className="flex gap-x-4 text-2xl font-bold text-sky-500">
          <Navoptions />
          {!session?.user ? (
            <>
              <li>
                <Link href="/auth/register" className=" hover:text-sky-400">
                  Regístrarse
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className=" hover:text-sky-400">
                  Iniciar Sesión
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/dashboard" className=" hover:text-sky-400">
                  Dashboard
                </Link>
              </li>
              <li>
                //TODO: Crear una alerta que permita cerrar sesion
                <Link href="/api/auth/signout" className=" hover:text-sky-400">
                  Cerrar Sesión
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
