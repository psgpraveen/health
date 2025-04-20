// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: "doctor" | "patient";
    };
  }

  interface User extends DefaultUser {
    role: "doctor" | "patient";
  }
}
