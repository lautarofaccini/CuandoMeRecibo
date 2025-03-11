import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import bcrypt from "bcrypt";

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (data.username) {
      const fusern = await conn.query(
        "SELECT * FROM usuarios WHERE username = ?",
        data.username
      );
      const usernameFound = fusern[0];
      if (usernameFound) {
        return NextResponse.json(
          { message: "El nombre de usuario ya esta en uso" },
          { status: 400 }
        );
      }
    }

    if (data.email) {
      const femail = await conn.query(
        "SELECT * FROM usuarios WHERE email = ?",
        data.email
      );
      const userFound = femail[0];
      if (userFound) {
        return NextResponse.json(
          { message: "El email ya esta en uso" },
          { status: 400 }
        );
      }
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const hashedData = { ...data, password: hashedPassword };

      const res = await conn.query("UPDATE usuarios SET ? WHERE id = ?", [
        hashedData,
        params.id,
      ]);
    } else {
      const res = await conn.query("UPDATE usuarios SET ? WHERE id = ?", [
        data,
        params.id,
      ]);
    }

    const updatedUser = await conn.query(
      "SELECT * FROM usuarios WHERE id = ?",
      params.id
    );
    const { password: _, ...user } = updatedUser[0];
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
