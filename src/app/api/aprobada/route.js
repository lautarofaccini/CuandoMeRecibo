import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

// TODO: Hacer que este get tambien pueda recibir dos ids para devolver una fila especifica
export async function GET() {
  try {
    const res = await conn.query("SELECT * FROM aprobada");
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { idAnteces, idSuces } = await request.json();
    const res = await conn.query("INSERT INTO aprobada SET ?", {
      idAnteces,
      idSuces,
    });
    return NextResponse.json({
      idAnteces,
      idSuces,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const res = await conn.query("DELETE FROM aprobada");
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
//TODO: Hacer un put que reciba dos ids y devuelva la fila actualizada
