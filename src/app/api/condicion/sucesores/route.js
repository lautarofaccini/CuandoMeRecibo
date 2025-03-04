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
      "SELECT idSuces FROM regularizada WHERE idAnteces = ?";
    const queryAprobada = "SELECT idSuces FROM aprobada WHERE idAnteces = ?";

    const [regularizadaResults, aprobadaResults] = await Promise.all([
      conn.query(queryRegularizada, id),
      conn.query(queryAprobada, id),
    ]);

    const regularizada = regularizadaResults.map((row) => row.idSuces);
    const aprobada = aprobadaResults.map((row) => row.idSuces);
    //SEGURO QUE ES ESTA LA SALIDA QUE QUIERO?
    return NextResponse.json([ ...regularizada, ...aprobada ]);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
