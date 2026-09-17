"use server";

import { redirect } from "next/navigation";
import {
  getCredentials,
  createSession,
  destroySession,
} from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const creds = getCredentials();
  if (username !== creds.username || password !== creds.password) {
    return { error: "Username atau password salah." };
  }

  await createSession(username);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}
