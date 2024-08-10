import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const res = await conn.query("SELECT * FROM usuarios");

    //TODO: Formatear la fecha de ser necesario
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    //Verificar si el usuario ya exista
    const userFound = await conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      email
    );
    if (userFound[0]) {
      return NextResponse.json(
        { message: "El usuario ya existe" },
        { status: 400 }
      );
    }

    //Verificar si el nombre de usuario ya exista
    const usernameFound = await conn.query(
      "SELECT * FROM usuarios WHERE username = ?",
      username
    );
    if (usernameFound[0]) {
      return NextResponse.json(
        { message: "El nombre de usuario ya esta en uso" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await conn.query("INSERT INTO usuarios SET ?", {
      username,
      email,
      password: hashedPassword,
    });

    const newUser = await conn.query(
      "SELECT * FROM usuarios WHERE id = ?",
      res.insertId
    );
    const {password: _, ...user} = newUser[0]
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
