"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function IssueList({
  issues,
  isDoctor,
  onResponded,
  onDeleted,
  onEdited,
}) {
  const { data: session } = useSession();
  const [response, setResponse] = useState({});
  const [editMode, setEditMode] = useState({});
  const [editText, setEditText] = useState({});
  const [loadingEdit, setLoadingEdit] = useState({});
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingRespond, setLoadingRespond] = useState({});
  const [replyText, setReplyText] = useState({});
  const [loadingReply, setLoadingReply] = useState({});

  // Doctor responds to patient
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

  // Patient toggles edit mode
  const handleEditToggle = (id, currentSymptoms) => {
    setEditMode({ ...editMode, [id]: !editMode[id] });
    setEditText({ ...editText, [id]: currentSymptoms });
  };

  // Patient saves edits
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

  // Patient deletes issue
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

  // Patient replies to doctor (threaded message)
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
            className="border p-5 mb-6 rounded-2xl bg-white shadow-lg transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
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
                className={
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold " +
                  (issue.status === "answered"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700")
                }
              >
                {issue.status === "answered" ? (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
              </span>
            </div>

            {/* Symptoms */}
            {editMode[issue._id] ? (
              <textarea
                className="input w-full mb-2"
                value={editText[issue._id] || ""}
                onChange={(e) =>
                  setEditText({ ...editText, [issue._id]: e.target.value })
                }
                rows={3}
                aria-label="Edit symptoms"
              />
            ) : (
              <p className="whitespace-pre-wrap text-gray-800 mb-2">
                {issue.symptoms}
              </p>
            )}

            {/* Uploaded Image */}
            {issue.imageUrl && (
              <img
                src={issue.imageUrl}
                alt="Uploaded symptom"
                className="w-32 h-32 object-cover rounded border mb-2"
                style={{ boxShadow: "0 2px 8px 0 rgba(59,130,246,0.08)" }}
              />
            )}

            {/* Conversation Thread */}
            <div className="mb-2">
              <div className="font-semibold text-blue-700 mb-1">Conversation:</div>
              <div className="space-y-2">
                {issue.messages &&
                  issue.messages.map((msg, idx) => (
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

            {/* Doctor's Response (legacy field, still shown for compatibility) */}
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
                {/* Edit/Delete */}
                <div className="flex gap-2">
                  {editMode[issue._id] ? (
                    <>
                      <button
                        className="btn bg-green-600 hover:bg-green-700"
                        onClick={() => handleEditSave(issue._id)}
                        disabled={loadingEdit[issue._id]}
                      >
                        {loadingEdit[issue._id] ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="white"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="white"
                                d="M4 12a8 8 0 018-8v8z"
                              />
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        className="btn bg-gray-400 hover:bg-gray-500"
                        onClick={() =>
                          setEditMode({ ...editMode, [issue._id]: false })
                        }
                        disabled={loadingEdit[issue._id]}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          handleEditToggle(issue._id, issue.symptoms)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="btn bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(issue._id)}
                        disabled={loadingDelete[issue._id]}
                      >
                        {loadingDelete[issue._id] ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="white"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="white"
                                d="M4 12a8 8 0 018-8v8z"
                              />
                            </svg>
                            Deleting...
                          </span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </>
                  )}
                </div>
                {/* Patient Reply */}
                <form
                  className="flex gap-2 mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePatientReply(issue._id);
                  }}
                >
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Type your reply..."
                    value={replyText[issue._id] || ""}
                    onChange={(e) =>
                      setReplyText({
                        ...replyText,
                        [issue._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="btn bg-blue-600 hover:bg-blue-700"
                    type="submit"
                    disabled={!replyText[issue._id] || loadingReply[issue._id]}
                  >
                    {loadingReply[issue._id] ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-1"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="white"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="white"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Doctor Controls */}
            {isDoctor && issue.status === "pending" && (
              <div className="mt-4">
                <label className="block mb-1 font-medium text-blue-700">
                  Doctor Response
                </label>
                <textarea
                  className="input w-full"
                  placeholder="Type your response"
                  value={response[issue._id] || ""}
                  onChange={(e) =>
                    setResponse({ ...response, [issue._id]: e.target.value })
                  }
                  rows={2}
                  aria-label="Doctor response"
                />
                <button
                  className="btn mt-2"
                  onClick={() => handleRespond(issue._id)}
                  disabled={loadingRespond[issue._id] || !response[issue._id]}
                >
                  {loadingRespond[issue._id] ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="white"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="white"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Response"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
