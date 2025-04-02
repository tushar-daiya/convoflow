import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="h-screen flex items-center justify-center bg-blue-100">
      {children}
    </div>
  );
}
