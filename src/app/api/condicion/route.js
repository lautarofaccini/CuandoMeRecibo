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

    const { idAnteces, idSuces, ids } = await request.json();
    // Caso 1: Si el cuerpo contiene un arreglo de IDs
    if (ids) {
      /*Formatos validos:
      {
      ids: [..., n],
      idAnteces: 1
      } 
      o
      {
      ids: [..., n],
      idSuces: 1
      }
      Devuelve arreglo vacio o con ids segun el que se solicite
      */ 
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { message: "Arreglo ids invalido" },
          { status: 400 }
        );
      }
      const isAnteces = idAnteces === 1;
      const isSuces = idSuces === 1;
      let query;
      const placeholders = ids.map(() => "?").join(",");
      if (isAnteces && !isSuces) {
        // Consultar por idAnteces
        query = `SELECT idAnteces FROM ${conn.escapeId(
          condicion
        )} WHERE idSuces IN (${placeholders})`;
      } else if (isSuces && !isAnteces) {
        // Consultar por idSuces
        query = `SELECT idSuces FROM ${conn.escapeId(
          condicion
        )} WHERE idAnteces IN (${placeholders})`;
      } else {
        // Si ninguno de los casos es verdadero, devolver un error
        return NextResponse.json(
          { message: "idAnteces o idSuces no validos" },
          { status: 400 }
        );
      }
      const res = await conn.query(query, ids);

      // Extraer los idSuces, eliminar duplicados y ordenar
      const idsEncontrados = Array.from(
        new Set(res.map((row) => row.idAnteces || row.idSuces))
      ).sort((a, b) => a - b);

      return NextResponse.json(idsEncontrados);

      // Caso 2: Si el cuerpo contiene solo idAnteces e idSuces
    } else if (idAnteces && idSuces) {
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
      const query = `INSERT INTO ${conn.escapeId(condicion)} SET ?`;
      const res = await conn.query(query, {
        idAnteces,
        idSuces,
      });

      return NextResponse.json({
        idAnteces,
        idSuces,
      });
    } else {
      return NextResponse.json(
        { message: "El cuerpo de la solicitud es inválido" },
        { status: 400 }
      );
    }
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
