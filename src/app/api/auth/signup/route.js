// src/app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  const { name, email, password, role } = await req.json();
  await dbConnect();
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }
  const user = await User.create({ name, email, password, role });
  return NextResponse.json({ message: "User created", user: { email: user.email, role: user.role } });
}
