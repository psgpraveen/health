"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import IssueList from "@/components/IssueList";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const { data: session, status } = useSession();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      fetch(`/api/health-issues?role=doctor`)
        .then(res => res.json())
        .then(data => {
          setIssues(data);
          setLoading(false);
        });
    } else {
      router.push("/");
    }
  }, [session,router]);

  // Stats
  const totalIssues = issues.length;
  const answeredIssues = issues.filter(i => i.status === "answered").length;
  const pendingIssues = totalIssues - answeredIssues;

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
                <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Dr. {session?.user?.name}</h1>
                <p className="text-gray-500 text-base mt-1">
                  Your Medical Dashboard – {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-blue-700">{totalIssues}</span>
                <span className="text-sm text-gray-500">Total Cases</span>
              </motion.div>
              <motion.div
                className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-yellow-700">{pendingIssues}</span>
                <span className="text-sm text-gray-500">Pending</span>
              </motion.div>
              <motion.div
                className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span className="text-3xl font-bold text-green-700">{answeredIssues}</span>
                <span className="text-sm text-gray-500">Answered</span>
              </motion.div>
            </div>
          </div>

          {/* Guidance Panel */}
          <div className="bg-blue-50/60 rounded-lg p-4 text-blue-700 text-center font-medium shadow">
            <span className="font-semibold">Quick Actions:</span> Review and resolve patient issues below. You can respond to pending cases, view conversations, and help patients with their health concerns.<br />
            <span className="text-blue-500">You cannot post new issues as a doctor.</span>
          </div>

          {/* Patient Issues List */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Patient Health Issues</h2>
            {issues.length === 0 ? (
              <div className="text-gray-500 text-center mt-4">
                <span>No active patient issues – great job!</span>
              </div>
            ) : (
              <IssueList
                issues={issues}
                isDoctor={true}
                onResponded={updatedIssue => {
                  setIssues(prev => prev.map(i => i._id === updatedIssue._id ? updatedIssue : i));
                }}
              />
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
