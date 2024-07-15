import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");

    let res;
    if (!idAnteces && !idSuces) {
      // Caso: Sin parámetros, obtener todas las filas
      res = await conn.query("SELECT * FROM aprobada");
      if (res.length === 0) {
        return NextResponse.json(
          {
            message: "No se encontraron resultados",
          },
          {
            status: 404,
          }
        );
      }
      return NextResponse.json(res);
    } else {
      if (idAnteces && idSuces) {
        // Caso: Ambos parámetros presentes
        res = await conn.query(
          "SELECT * FROM aprobada WHERE idAnteces = ? AND idSuces = ?",
          [idAnteces, idSuces]
        );
        if (res.length === 0) {
          return NextResponse.json(
            {
              message: "Relación no encontrada",
            },
            {
              status: 404,
            }
          );
        }
      } else if (idAnteces) {
        // Caso: Solo idAnteces presente
        res = await conn.query(
          "SELECT * FROM aprobada WHERE idAnteces = ?",
          [idAnteces]
        );
      } else if (idSuces) {
        // Caso: Solo idSuces presente
        res = await conn.query("SELECT * FROM aprobada WHERE idSuces = ?", [
          idSuces,
        ]);
      }
      return NextResponse.json(res);
    }
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
    const { searchParams } = new URL(request.url);
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");
    const res = await conn.query(
      "DELETE FROM aprobada WHERE idAnteces = ? AND idSuces = ?",
      [idAnteces, idSuces]
    );
    if (res.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Relacion no encontrada",
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
    const { searchParams } = new URL(request.url);
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");
    // Validación de entrada
    if (isNaN(idAnteces) || isNaN(idSuces)) {
      return NextResponse.json(
        {
          message: "Invalid idAnteces or idSuces",
        },
        {
          status: 400,
        }
      );
    }

    const data = await request.json();
    const res = await conn.query(
      "UPDATE aprobada SET ? WHERE idAnteces = ? AND idSuces = ?",
      [data, idAnteces, idSuces]
    );
    if (res.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Relacion no encontrada",
        },
        {
          status: 404,
        }
      );
    }
    let updatedReg;
    if (data.idAnteces) {
      updatedReg = await conn.query(
        "SELECT * FROM aprobada WHERE idAnteces = ? AND idSuces = ?",
        [data.idAnteces, idSuces]
      );
    } else if (data.idSuces) {
      updatedReg = await conn.query(
        "SELECT * FROM aprobada WHERE idAnteces = ? AND idSuces = ?",
        [idAnteces, data.idSuces]
      );
    }

    return NextResponse.json(updatedReg[0]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
