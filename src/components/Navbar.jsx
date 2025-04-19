"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-xl">
          <svg width="28" height="28" viewBox="0 0 96 96" fill="none">
            <rect width="96" height="96" rx="24" fill="#3b82f6" fillOpacity="0.08" />
            <circle cx="48" cy="48" r="28" fill="#fff" stroke="#3b82f6" strokeWidth="4" />
            <path d="M48 34v28M34 48h28" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          </svg>
          Health Platform
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {session?.user && (
          <>
            <Link href="/dashboard/patient" className="text-blue-600 hover:underline font-medium">
              Dashboard
            </Link>
            <span className="text-gray-600 text-sm">{session.user.name} ({session.user.role})</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
