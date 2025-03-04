import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (isNaN(id)) {
      return NextResponse.json(
        {
          message: "Invalid id",
        },
        {
          status: 400,
        }
      );
    }
    const queryRegularizada =
      "SELECT idAnteces FROM regularizada WHERE idSuces = ?";
    const queryAprobada = "SELECT idAnteces FROM aprobada WHERE idSuces = ?";

    const [regularizadaResults, aprobadaResults] = await Promise.all([
      conn.query(queryRegularizada, id),
      conn.query(queryAprobada, id),
    ]);

    const regularizada = regularizadaResults.map((row) => row.idAnteces);
    const aprobada = aprobadaResults.map((row) => row.idAnteces);

    return NextResponse.json({ regularizada, aprobada });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
