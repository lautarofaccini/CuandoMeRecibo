import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { conn } from "@/libs/mysql";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {

        const rows = await conn.query(
          "SELECT * FROM usuarios WHERE email = ?",
          credentials.email
        );
        const userFound = rows[0];
        if (!userFound) throw new Error("Usuario no encontrado");

        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!matchPassword) throw new Error("Contraseña incorrecta");

        return {
          id: userFound.id,
          name: userFound.username,
          email: userFound.email,
        };
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
