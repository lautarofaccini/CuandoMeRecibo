"use client";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
    } else {
      const res = await axios.post("/api/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });
      if ((res.status = 200)) {
        router.push("/auth/login");
      }
    }
  });
  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form className="w-1/4" onSubmit={onSubmit}>
        <h1 className="text-slate-200 font-bold text-3xl mb-4">Registrar</h1>
        <label className="text-slate-200 mb-2 block text-sm" htmlFor="username">
          Nombre de usuario:
        </label>
        <input
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          type="username"
          placeholder="usuario123"
          {...register("username", {
            required: {
              value: true,
              message: "Nombre de usuario requerido",
            },
          })}
        />
        {errors.username && (
          <span className="text-red-500 text-xs">
            {errors.username.message}
          </span>
        )}
        <label className="text-slate-200 mb-2 block text-sm" htmlFor="email">
          Correo:
        </label>
        <input
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          type="email"
          placeholder="correo@email.com"
          {...register("email", {
            required: {
              value: true,
              message: "Correo requerido",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-xs">{errors.email.message}</span>
        )}
        <label className="text-slate-200 mb-2 block text-sm" htmlFor="password">
          Contraseña:
        </label>
        <input
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          type="password"
          placeholder="********"
          {...register("password", {
            required: {
              value: true,
              message: "Contraseña requerida",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
        <label
          className="text-slate-200 mb-2 block text-sm"
          htmlFor="confirmPassword"
        >
          Confirmar Contraseña:
        </label>
        <input
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
          type="password"
          placeholder="********"
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Repetir contraseña requerido",
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </span>
        )}
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 mt-2">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
