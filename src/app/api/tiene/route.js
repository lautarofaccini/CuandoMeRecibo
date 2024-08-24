import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const condicion = searchParams.get("cond");
    //condicion puede ser regularizo o aprobo
    if (!condicion) {
      return NextResponse.json(
        { message: "Falta el parámetro 'cond'" },
        { status: 400 }
      );
    }
    //TODO: Get todos los dni para este id, todos los id para este dni, o si existe relacion para esta convinacion dni/id
    const dni = searchParams.get("dni");
    const id = searchParams.get("id");

    if (isNaN(dni) || isNaN(id)) {
      return NextResponse.json(
        {
          message: "Invalid dni or id",
        },
        {
          status: 400,
        }
      );
    }

    let query = `SELECT * FROM ${conn.escapeId(condicion)}`; //escapeId previene las inyecciones SQL
    const queryParams = [];
    let res;
    if (!dni && !id) {
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
    } else if (dni && id) {
      query += " WHERE dni = ? AND id = ?";
      queryParams.push(dni, id);
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
    } else if (dni) {
      query += " WHERE dni = ?";
      queryParams.push(dni);
      res = await conn.query(query, queryParams);
    } else if (id) {
      query += " WHERE id = ?";
      queryParams.push(id);
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
    const { dni, id } = await request.json();
    const query = `INSERT INTO ${conn.escapeId(condicion)} SET ?`;
    const res = await conn.query(query, {
      dni,
      id,
    });
    return NextResponse.json({
      dni,
      id,
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
    const dni = searchParams.get("dni");
    const id = searchParams.get("id");
    if (isNaN(dni) || isNaN(id)) {
      return NextResponse.json(
        {
          message: "Invalid dni or id",
        },
        {
          status: 400,
        }
      );
    }
    const query = `DELETE FROM ${conn.escapeId(
      condicion
    )} WHERE dni = ? AND id = ?`;
    const res = await conn.query(query, [dni, id]);
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
    const dni = searchParams.get("dni");
    const id = searchParams.get("id");
    if (isNaN(dni) || isNaN(id)) {
      return NextResponse.json(
        {
          message: "Invalid dni or id",
        },
        {
          status: 400,
        }
      );
    }
    const data = await request.json();
    //Solo enviar id, dni es al pedo 
    let query = `UPDATE ${conn.escapeId(
      condicion
    )} SET ? WHERE dni = ? AND id = ?`;
    const res = await conn.query(query, [data, dni, id]);
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
    )} WHERE dni = ? AND id = ?`;
    if (data.dni) {
      updatedReg = await conn.query(query, [data.dni, id]);
    } else if (data.id) {
      updatedReg = await conn.query(query, [dni, data.id]);
    }
    return NextResponse.json(updatedReg[0]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}