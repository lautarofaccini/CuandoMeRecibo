import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const res = await conn.query("SELECT * FROM materias");

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
      plan
    });
    
    return NextResponse.json({
        id,
        asignatura,
        nivel,
        dictado,
        plan
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
