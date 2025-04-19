"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useState } from "react";

const COMMON_QUESTIONS = [
  {
    name: "fever",
    label: "Do you have a fever?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    name: "duration",
    label: "How long have you had these symptoms?",
    type: "select",
    options: [
      "Less than 24 hours",
      "1-3 days",
      "4-7 days",
      "More than a week",
    ],
  },
  {
    name: "travel",
    label: "Have you traveled recently?",
    type: "radio",
    options: ["Yes", "No"],
  },
];

export default function HealthIssueForm({ onSubmitted }) {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (data) => {
    setUploading(true);
    let imageUrl = "";
    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      imageUrl = uploadData.url;
    }
    // Combine common questions into the symptoms description
    const commonAnswers = COMMON_QUESTIONS.map(q => `${q.label} ${data[q.name]}`).join("; ");
    const fullSymptoms = `${commonAnswers}; Symptoms: ${data.symptoms}`;
    const res = await fetch("/api/health-issues", {
      method: "POST",
      body: JSON.stringify({ userId: session.user.id, symptoms: fullSymptoms, imageUrl }),
      headers: { "Content-Type": "application/json" },
    });
    const issue = await res.json();
    onSubmitted(issue);
    reset();
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-4 bg-blue-50 rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">Quick Health Questions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {COMMON_QUESTIONS.map(q => (
          <div key={q.name}>
            <label className="block text-gray-700 font-medium mb-1">{q.label}</label>
            {q.type === "radio" ? (
              <div className="flex gap-4">
                {q.options.map(opt => (
                  <label key={opt} className="flex items-center gap-1">
                    <input
                      type="radio"
                      value={opt}
                      {...register(q.name, { required: true })}
                      className="accent-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <select {...register(q.name, { required: true })} className="input">
                <option value="">Select</option>
                {q.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <label className="block text-gray-700 font-medium mb-1 mt-2">Describe your symptoms</label>
      <textarea {...register("symptoms", { required: true })} placeholder="Describe your symptoms" className="input w-full mb-2" required />
      <label className="block text-gray-700 font-medium mb-1">Upload an image (optional)</label>
      <input type="file" {...register("image")} accept="image/*" className="mb-2" />
      <button type="submit" className="btn" disabled={uploading}>
        {uploading ? "Submitting..." : "Submit Issue"}
      </button>
    </form>
  );
}
