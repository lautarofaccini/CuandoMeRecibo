import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request, { params }) {
  try {
    const res = await conn.query("SELECT * FROM estudiantes WHERE id = ?", [
      params.id,
    ]);
    if (res.length === 0) {
      return NextResponse.json(
        {
          message: "Estudiante no encontrado",
        },
        {
          status: 404,
        }
      );
    }
    
    // Formatear la fecha
    const estudiante = res[0];
    estudiante.fechaNac = estudiante.fechaNac.toISOString().split('T')[0];

    return NextResponse.json(estudiante);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const res = await conn.query("DELETE FROM estudiantes WHERE id = ?", [
      params.id,
    ]);
    if (res.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Estudiante no encontrado",
        },
        {
          status: 404,
        }
      );
    }
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const res = await conn.query("UPDATE estudiantes SET ? WHERE id = ?", [
      data,
      params.id,
    ]);
    if (res.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Estudiante no encontrado",
        },
        {
          status: 404,
        }
      );
    }
    const updatedEst = await conn.query(
      "SELECT * FROM estudiantes WHERE id = ?",
      [params.id]
    );
    return NextResponse.json(updatedEst[0]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
