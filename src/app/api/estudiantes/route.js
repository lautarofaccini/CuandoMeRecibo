import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const res = await conn.query("SELECT * FROM estudiantes");

    // Formatear la fecha
    const formattedRes = res.map((row) => {
      return {
        ...row,
        fechaNac: row.fechaNac.toISOString().split("T")[0],
      };
    });

    return NextResponse.json(formattedRes);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { dni, nombre, apellido, fechaNac } =
      await request.json();
    const res = await conn.query("INSERT INTO estudiantes SET ?", {
      dni,
      nombre,
      apellido,
      fechaNac,
    });

    return NextResponse.json({
      dni,
      nombre,
      apellido,
      fechaNac,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
