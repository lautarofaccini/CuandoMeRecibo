import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <nav className="bg-zinc-950 text-white py-3 mb-2">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-3xl text-sky-100 hover:text-white">Cuando Me Recibo?</Link>
        <ul>
          <li>
            <Link href="/estudiantes" className="text-sky-500 hover:text-sky-400">Estudiantes</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
