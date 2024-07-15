import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const condicion = searchParams.get("cond");
    if (!condicion) {
      return NextResponse.json(
        { message: "Falta el parámetro 'cond'" },
        { status: 400 }
      );
    }
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");

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

    let query = `SELECT * FROM ${conn.escapeId(condicion)}`; //escapeId previene las inyecciones SQL
    const queryParams = [];
    let res;
    if (!idAnteces && !idSuces) {
      res = await conn.query(query);
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
    } else if (idAnteces && idSuces) {
      query += " WHERE idAnteces = ? AND idSuces = ?";
      queryParams.push(idAnteces, idSuces);
      res = await conn.query(query, queryParams);
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
    } else if (idAnteces) {
      query += " WHERE idAnteces = ?";
      queryParams.push(idAnteces);
      res = await conn.query(query, queryParams);
    } else if (idSuces) {
      query += " WHERE idSuces = ?";
      queryParams.push(idSuces);
      res = await conn.query(query, queryParams);
    }
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const condicion = searchParams.get("cond");
    if (!condicion) {
      return NextResponse.json(
        { message: "Falta el parámetro 'cond'" },
        { status: 400 }
      );
    }
    const { idAnteces, idSuces } = await request.json();
    const query = `INSERT INTO ${conn.escapeId(condicion)} SET ?`;
    const res = await conn.query(query, {
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
    const condicion = searchParams.get("cond");
    if (!condicion) {
      return NextResponse.json(
        { message: "Falta el parámetro 'cond'" },
        { status: 400 }
      );
    }
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");
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
    const query = `DELETE FROM ${conn.escapeId(
      condicion
    )} WHERE idAnteces = ? AND idSuces = ?`;
    const res = await conn.query(query, [idAnteces, idSuces]);
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

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const condicion = searchParams.get("cond");
    if (!condicion) {
      return NextResponse.json(
        { message: "Falta el parámetro 'cond'" },
        { status: 400 }
      );
    }
    const idAnteces = searchParams.get("id1");
    const idSuces = searchParams.get("id2");
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
    let query = `UPDATE ${conn.escapeId(
      condicion
    )} SET ? WHERE idAnteces = ? AND idSuces = ?`;
    const res = await conn.query(query, [data, idAnteces, idSuces]);
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
    query = `SELECT * FROM ${conn.escapeId(
      condicion
    )} WHERE idAnteces = ? AND idSuces = ?`;
    if (data.idAnteces) {
      updatedReg = await conn.query(query, [data.idAnteces, idSuces]);
    } else if (data.idSuces) {
      updatedReg = await conn.query(query, [idAnteces, data.idSuces]);
    }
    return NextResponse.json(updatedReg[0]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
