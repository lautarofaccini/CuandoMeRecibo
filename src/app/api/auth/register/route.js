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
    const femail = await conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      email
    );
    const userFound = femail[0]
    if (userFound) {

      return NextResponse.json(
        { message: "El usuario ya existe" },
        { status: 400 }
      );
    }

    //Verificar si el nombre de usuario ya exista
    const fusern = await conn.query(
      "SELECT * FROM usuarios WHERE username = ?",
      username
    );
    const usernameFound = fusern[0]
    if (usernameFound) {
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
