import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type FormData = { email: string; password: string; remember: boolean };

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ defaultValues: { email: "", password: "", remember: false } });

  const onSubmit = async (data: FormData) => {
    // Simula validación (cliente). No envía datos a ningún servidor.
    await new Promise((r) => setTimeout(r, 300));
    // “Guarda sesión” localmente (solo email). Si tildas "Recordarme", persiste en localStorage.
    login({ email: data.email }, data.remember);
    alert("Sesión iniciada (demo).");
    navigate("/");
  };

  return (
    <section className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="order-2 lg:order-1">
        <h1 className="text-2xl font-bold mb-2">Ingresar</h1>
        <p className="text-white/70 mb-6">Validación en cliente. No hay backend ni se guarda la contraseña.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4 max-w-md">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Correo</label>
            <input
              id="email" type="email" placeholder="tu@email.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Formato inválido" },
              })}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">Contraseña</label>
            <input
              id="password" type="password" placeholder="********"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" {...register("remember")} className="accent-brand-500" />
            <span>Recordarme</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? "Validando..." : "Ingresar"}
          </button>
        </form>
      </div>

      <div className="order-1 lg:order-2">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop"
          alt="Personas escuchando música"
          className="rounded-2xl shadow-soft"
        />
      </div>
    </section>
  );
}
