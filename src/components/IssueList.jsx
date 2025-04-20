"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IssueList({
  issues,
  isDoctor,
  onResponded,
  onDeleted,
  onEdited,
}) {
  const [response, setResponse] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editText, setEditText] = useState({});
  const [loadingEdit, setLoadingEdit] = useState({});
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingRespond, setLoadingRespond] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loadingReply, setLoadingReply] = useState({});

  const handleRespond = async (id) => {
    setLoadingRespond((prev) => ({ ...prev, [id]: true }));
    const res = await fetch("/api/health-issues", {
      method: "PATCH",
      body: JSON.stringify({ issueId: id, doctorResponse: response[id] }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    onResponded && onResponded(updated);
    setResponse({ ...response, [id]: "" });
    setLoadingRespond((prev) => ({ ...prev, [id]: false }));
  };

  const handleEditToggle = (id, currentSymptoms) => {
    setEditMode({ ...editMode, [id]: !editMode[id] });
    setEditText({ ...editText, [id]: currentSymptoms });
  };

  const handleEditSave = async (id) => {
    setLoadingEdit((prev) => ({ ...prev, [id]: true }));
    const res = await fetch("/api/health-issues", {
      method: "PATCH",
      body: JSON.stringify({ issueId: id, symptoms: editText[id] }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    onEdited && onEdited(updated);
    setEditMode({ ...editMode, [id]: false });
    setLoadingEdit((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    setLoadingDelete((prev) => ({ ...prev, [id]: true }));
    const res = await fetch(`/api/health-issues?issueId=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onDeleted && onDeleted(id);
    } else {
      alert("Failed to delete the issue.");
    }
    setLoadingDelete((prev) => ({ ...prev, [id]: false }));
  };

  const handlePatientReply = async (id) => {
    if (!replyText[id]) return;
    setLoadingReply((prev) => ({ ...prev, [id]: true }));
    const res = await fetch("/api/health-issues", {
      method: "PATCH",
      body: JSON.stringify({
        issueId: id,
        message: replyText[id],
        sender: "patient",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    onEdited && onEdited(updated);
    setReplyText({ ...replyText, [id]: "" });
    setLoadingReply((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div>
      <AnimatePresence>
        {issues.map((issue) => (
          <motion.div
            key={issue._id}
            className="border p-5 mb-6 rounded-2xl bg-white shadow-md transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex justify-between items-start sm:items-center mb-3 flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-700 text-lg">
                  Symptoms
                </span>
                {editMode[issue._id] && (
                  <span className="ml-2 text-xs text-gray-400 italic">
                    Editing
                  </span>
                )}
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  issue.status === "answered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {issue.status === "answered" ? "✔️ Answered" : "⏳ Pending"}
              </span>
            </div>

            {editMode[issue._id] ? (
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editText[issue._id] || ""}
                onChange={(e) =>
                  setEditText({ ...editText, [issue._id]: e.target.value })
                }
                rows={3}
              />
            ) : (
              <p className="whitespace-pre-wrap text-gray-800 mb-2">
                {issue.symptoms}
              </p>
            )}

            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Uploaded symptom"
                className="w-32 h-32 object-cover rounded border mb-2 shadow-sm"
              />
            )}

            <div className="mb-2">
              <div className="font-semibold text-blue-700 mb-1">Conversation:</div>
              <div className="space-y-2">
                {issue.messages?.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "doctor"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-xl px-3 py-2 max-w-xs text-sm ${
                        msg.sender === "doctor"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <span className="font-bold">
                        {msg.sender === "doctor" ? "Doctor" : "You"}:
                      </span>{" "}
                      {msg.text}
                      <span className="block text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {issue.doctorResponse && (
              <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded mb-2">
                <span className="font-semibold text-green-700">
                  Doctor's Response:
                </span>
                <div className="text-gray-700 mt-1">{issue.doctorResponse}</div>
              </div>
            )}

            {/* Patient Controls */}
            {!isDoctor && (
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex gap-2 flex-wrap">
                  {editMode[issue._id] ? (
                    <>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                          loadingEdit[issue._id]
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 cursor-pointer"
                        }`}
                        onClick={() => handleEditSave(issue._id)}
                        disabled={loadingEdit[issue._id]}
                      >
                        {loadingEdit[issue._id] ? "Saving..." : "Save"}
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        onClick={() => handleEditToggle(issue._id)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-4 py-2 rounded-md text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                        onClick={() =>
                          handleEditToggle(issue._id, issue.symptoms)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 ${
                          loadingDelete[issue._id]
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => handleDelete(issue._id)}
                        disabled={loadingDelete[issue._id]}
                      >
                        {loadingDelete[issue._id] ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </div>

                {/* Reply to Doctor */}
                <div className="flex flex-col gap-2 mt-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Reply to doctor..."
                    value={replyText[issue._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [issue._id]: e.target.value })
                    }
                    rows={2}
                  />
                  <button
                    className={`self-end px-4 py-2 rounded-md text-sm font-medium text-white ${
                      loadingReply[issue._id]
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    }`}
                    onClick={() => handlePatientReply(issue._id)}
                    disabled={loadingReply[issue._id]}
                  >
                    {loadingReply[issue._id] ? "Replying..." : "Send Reply"}
                  </button>
                </div>
              </div>
            )}

            {/* Doctor Respond Input */}
            {isDoctor && issue.status !== "answered" && (
              <div className="mt-3 flex flex-col gap-2">
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Type your response..."
                  value={response[issue._id] || ""}
                  onChange={(e) =>
                    setResponse({ ...response, [issue._id]: e.target.value })
                  }
                  rows={2}
                />
                <button
                  className={`self-end px-4 py-2 rounded-md text-sm font-medium text-white ${
                    loadingRespond[issue._id]
                      ? "bg-green-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 cursor-pointer"
                  }`}
                  onClick={() => handleRespond(issue._id)}
                  disabled={loadingRespond[issue._id]}
                >
                  {loadingRespond[issue._id] ? "Sending..." : "Respond"}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
