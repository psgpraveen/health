"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import HealthIssueForm from "@/components/HealthIssueForm";
import IssueList from "@/components/IssueList";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      fetch(`/api/health-issues?role=patient&userId=${session.user.id}`)
        .then(res => res.json())
        .then(data => {
          setIssues(data);
          setLoading(false);
        });
    }else {
      router.push("/");
    }
  }, [session]);

  // Calculate stats
  const totalIssues = issues.length;
  const answeredIssues = issues.filter(i => i.status === "answered").length;

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-green-50">
        <div className="text-blue-700 text-xl font-semibold animate-pulse">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-green-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 md:px-0">
        <motion.div
          className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl mt-10 mb-8 p-6 md:p-12 flex flex-col gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Header and Stats */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 96 96" fill="none">
                <rect width="96" height="96" rx="24" fill="#3b82f6" fillOpacity="0.08" />
                <circle cx="48" cy="48" r="28" fill="#fff" stroke="#3b82f6" strokeWidth="4" />
                <path d="M48 34v28M34 48h28" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Hello, {session?.user?.name || "Patient"}!</h1>
                <p className="text-gray-500 text-base mt-1">
                  Welcome to your <span className="font-semibold text-blue-600">Health Dashboard</span>.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-blue-700">{totalIssues}</span>
                <span className="text-sm text-gray-500">Total Issues</span>
              </motion.div>
              <motion.div
                className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-green-700">{answeredIssues}</span>
                <span className="text-sm text-gray-500">Answered</span>
              </motion.div>
            </div>
          </div>

          {/* Motivation/Instructions */}
          <div className="bg-blue-50/60 rounded-lg p-4 text-blue-700 text-center font-medium shadow">
            Please answer a few quick questions and describe your symptoms. Our doctors will review your case and respond as soon as possible.<br />
            <span className="text-blue-500 font-semibold">Your well-being is our priority!</span>
          </div>

          {/* Health Issue Form */}
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Submit a New Health Issue</h2>
            <HealthIssueForm onSubmitted={issue => setIssues([issue, ...issues])} />
          </div>

          {/* Issue List */}
          <div>
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Your Health Issues</h2>
            {issues.length === 0 ? (
              <div className="text-gray-500 text-center mt-4">
                <span>
                  You haven't submitted any health issues yet.<br />
                  Use the form above to get started and receive expert advice!
                </span>
              </div>
            ) : (
              <IssueList issues={issues} isDoctor={false} />
            )}
          </div>
        </motion.div>
      </main>
      <footer className="w-full py-4 text-center text-gray-400 text-xs bg-transparent">
        &copy; {new Date().getFullYear()} Health Platform. All rights reserved.
      </footer>
    </div>
  );
}
