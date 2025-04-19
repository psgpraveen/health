"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if ((session?.user as any)?.role === "doctor") {
        router.replace("/dashboard/doctor");
      } else if ((session?.user as any)?.role === "patient") {
        router.replace("/dashboard/patient");
      }
      
    }
    // Do not redirect unauthenticated users automatically
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-2xl font-semibold text-blue-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Animated SVG */}
        <motion.svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <rect width="96" height="96" rx="24" fill="#3b82f6" fillOpacity="0.08" />
          <circle cx="48" cy="48" r="28" fill="#fff" stroke="#3b82f6" strokeWidth="4" />
          <motion.path
            d="M48 34v28M34 48h28"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </motion.svg>

        <motion.h1
          className="text-4xl font-bold text-blue-700 mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Welcome to the Health Platform
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Your personal health assistant! <br />
          <span className="font-medium text-blue-600">Patients</span> can submit symptoms and images, while <span className="font-medium text-blue-600">Doctors</span> can review and respond to health issues.<br />
          Secure, private, and easy to use.
        </motion.p>
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/login"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 rounded border border-blue-600 text-blue-700 font-semibold shadow hover:bg-blue-50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </Link>
        </motion.div>
        <motion.div
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span>Demo accounts:</span>
          <ul className="mt-2">
            <li>
              <b>Doctor:</b> <span className="font-mono">doctor@example.com / password</span>
            </li>
            <li>
              <b>Patient:</b> <span className="font-mono">patient@example.com / password</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
      <motion.footer
        className="mt-8 text-gray-400 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        &copy; {new Date().getFullYear()} Health Platform. All rights reserved.
      </motion.footer>
    </main>
  );
}
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;

      if (role === "doctor") {
        router.replace("/dashboard/doctor");
      } else if (role === "patient") {
        router.replace("/dashboard/patient");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-2xl font-semibold text-blue-700 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        className="bg-white shadow-xl rounded-lg p-8 max-w-xl w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: [0.8, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <rect width="96" height="96" rx="24" fill="#3b82f6" fillOpacity="0.08" />
          <circle cx="48" cy="48" r="28" fill="#fff" stroke="#3b82f6" strokeWidth="4" />
          <motion.path
            d="M48 34v28M34 48h28"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              delay: 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </motion.svg>

        <motion.h1
          className="text-4xl font-bold text-blue-700 mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Welcome to the Health Platform
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Your personal health assistant! <br />
          <span className="font-medium text-blue-600">Patients</span> can submit symptoms and images, while{" "}
          <span className="font-medium text-blue-600">Doctors</span> can review and respond to health issues.
          <br />
          Secure, private, and easy to use.
        </motion.p>
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link
            href="/login"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 rounded border border-blue-600 text-blue-700 font-semibold shadow hover:bg-blue-50 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </Link>
        </motion.div>
        <motion.div
          className="mt-6 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span>Demo accounts:</span>
          <ul className="mt-2">
            <li>
              <b>Doctor:</b> <span className="font-mono">doctor@example.com / password</span>
            </li>
            <li>
              <b>Patient:</b> <span className="font-mono">patient@example.com / password</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
      <motion.footer
        className="mt-8 text-gray-400 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        &copy; {new Date().getFullYear()} Health Platform. All rights reserved.
      </motion.footer>
    </main>
  );
}
