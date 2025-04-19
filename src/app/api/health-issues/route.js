// src/app/api/health-issues/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HealthIssue from "@/models/HealthIssue";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const userId = searchParams.get("userId");

  if (role === "doctor") {
    const issues = await HealthIssue.find().populate("user", "name email");
    return NextResponse.json(issues);
  } else {
    const issues = await HealthIssue.find({ user: userId });
    return NextResponse.json(issues);
  }
}

export async function POST(req) {
  await dbConnect();
  const { userId, symptoms, imageUrl } = await req.json();
  const issue = await HealthIssue.create({ user: userId, symptoms, imageUrl });
  return NextResponse.json(issue);
}

export async function PATCH(req) {
  await dbConnect();
  const { issueId, doctorResponse, symptoms, message, sender } = await req.json();

  // 1. Handle threaded messages (patient/doctor replies)
  if (message && sender) {
    const issue = await HealthIssue.findByIdAndUpdate(
      issueId,
      { $push: { messages: { sender, text: message } } },
      { new: true }
    );
    return NextResponse.json(issue);
  }

  // 2. Handle existing fields (doctor response or symptom edits)
  const updateData = {};
  if (doctorResponse !== undefined) {
    updateData.doctorResponse = doctorResponse;
    updateData.status = "answered"; // Auto-update status when doctor responds
  }
  if (symptoms !== undefined) updateData.symptoms = symptoms;

  const issue = await HealthIssue.findByIdAndUpdate(
    issueId,
    updateData,
    { new: true }
  );
  return NextResponse.json(issue);
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("issueId");
  if (!issueId) {
    return NextResponse.json({ error: "Missing issueId" }, { status: 400 });
  }
  await HealthIssue.findByIdAndDelete(issueId);
  return NextResponse.json({ message: "Issue deleted" });
}
