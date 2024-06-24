import Link from "next/link";

function ButtonNuevo({ pathname }) {
  return (
      <Link
        href={"/" + pathname.split("/")[1] + "/new"}
        className=" hover:text-sky-400"
      >
        Nuevo
      </Link>
  );
}

export default ButtonNuevo;
