import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    let query;
    let params = [];

    if (email) {
      query = "SELECT * FROM usuarios WHERE email = ?";
      params = [email];
    } else {
      query = "SELECT * FROM usuarios";
    }

    const [results] = await conn.query(query, params);

    if (results.length === 0) {
      return NextResponse.json({ message: "No se encontraron usuarios" }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
