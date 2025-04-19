"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setSignupError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      router.push("/login");
    } else {
      const err = await res.json();
      setSignupError(err.error || "Signup failed. Please try again.");
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
          <h2 className="text-2xl font-bold text-blue-700 mt-2">Create Account</h2>
        </div>

        <input
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className="input"
          autoComplete="name"
        />
        {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}

        <input
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
          className="input"
          autoComplete="email"
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}

        <input
          {...register("password", { required: "Password is required", minLength: { value: 4, message: "Password must be at least 4 characters" } })}
          placeholder="Password"
          type="password"
          className="input"
          autoComplete="new-password"
        />
        {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}

        <select {...register("role", { required: "Role is required" })} className="input">
          <option value="">Select role</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
        {errors.role && <span className="text-red-500 text-xs">{errors.role.message}</span>}

        {signupError && (
          <motion.div
            className="text-red-600 text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {signupError}
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex justify-between items-center mt-2 text-sm">
          <span className="text-gray-500">Already have an account?</span>
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </motion.form>
    </main>
  );
}
