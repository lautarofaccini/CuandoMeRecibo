"use client";
import { useForm } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error);
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form className="w-1/4" onSubmit={onSubmit}>
        {error && (
          <p className=" bg-red-500 text-lg text-white p-3 rounded">{error}</p>
        )}
        <h1 className="text-slate-200 font-bold text-3xl mb-4">
          Iniciar Sesión
        </h1>
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
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-500 mt-2">
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
