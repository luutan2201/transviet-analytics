import type {
  LoginRequest,
  LoginResponse,
  CurrentUser,
} from "@/features/authentication/types/auth.types";

async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return (await response.json()) as LoginResponse;
}

async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

async function getCurrentUser(): Promise<CurrentUser | null> {
  const response = await fetch("/api/auth/me");
  const data = (await response.json()) as { user: CurrentUser | null };
  return data.user;
}

export const authService = { login, logout, getCurrentUser };
