import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const nivel = searchParams.get("nivel");
    let res;
    if (!nivel) {
      res = await conn.query("SELECT * FROM materias");
    } else {
      res = await conn.query("SELECT * FROM materias WHERE nivel < " + nivel);
    }
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id, asignatura, nivel, dictado, plan } = await request.json();
    const res = await conn.query("INSERT INTO materias SET ?", {
      id,
      asignatura,
      nivel,
      dictado,
      plan,
    });

    return NextResponse.json({
      id,
      asignatura,
      nivel,
      dictado,
      plan,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
