import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");

    let res; 
    if (idAnteces && idSuces) {
      res = await conn.query(
        "SELECT * FROM regularizada WHERE idAnteces = ? AND idSuces = ?",
        [idAnteces, idSuces]
      );
      if (res.length === 0) {
        return NextResponse.json(
          {
            message: "Relacion no encontrada",
          },
          {
            status: 404,
          }
        );
      }
      
    } else {
      res = await conn.query("SELECT * FROM regularizada");
    }
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { idAnteces, idSuces } = await request.json();
    const res = await conn.query("INSERT INTO regularizada SET ?", {
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
    const res = await conn.query("DELETE FROM regularizada");
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
//TODO: Hacer un put que reciba dos ids y devuelva la fila actualizada
