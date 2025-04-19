// src/models/HealthIssue.js
import mongoose from "mongoose";

const HealthIssueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symptoms: String,
  imageUrl: String,
  doctorResponse: String,
  messages: [
    {
      sender: { type: String, enum: ["patient", "doctor"], required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],  status: { type: String, enum: ["pending", "answered"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HealthIssue || mongoose.model("HealthIssue", HealthIssueSchema);
// models/HealthIssue.js

