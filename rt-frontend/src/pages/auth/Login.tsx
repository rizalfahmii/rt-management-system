import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import type { LoginPayload } from "../../types/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login Admin RT
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded mb-5"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}