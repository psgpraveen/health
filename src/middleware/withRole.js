"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withRole(Component, allowedRoles) {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session || !allowedRoles.includes(session.user.role)) {
        router.push("/");
      }
    }, [session, status,router]);

    if (!session || !allowedRoles.includes(session.user.role)) return null;
    return <Component {...props} />;
  };
}
