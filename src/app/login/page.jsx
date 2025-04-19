"use client";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setAuthError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
    } else {
      setAuthError("Invalid email or password.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 flex flex-col gap-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center mb-2">
          <svg width="48" height="48" viewBox="0 0 96 96" fill="none">
            <rect width="96" height="96" rx="24" fill="#3b82f6" fillOpacity="0.08" />
            <circle cx="48" cy="48" r="28" fill="#fff" stroke="#3b82f6" strokeWidth="4" />
            <path d="M48 34v28M34 48h28" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-700 mt-2">Sign In</h2>
        </div>
        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
          className="input"
          autoComplete="email"
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
          className="input"
          autoComplete="current-password"
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

        {authError && (
          <motion.div
            className="text-red-600 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {authError}
          </motion.div>
        )}

        <button
          type="submit"
          className="btn mt-2 w-full flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : null}
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-500">Don't have an account?</span>
          <Link href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </div>
        <div className="mt-4 text-xs text-center text-gray-400">
          <span>Demo accounts: doctor@example.com / password</span>
        </div>
      </motion.form>
    </main>
  );
}
