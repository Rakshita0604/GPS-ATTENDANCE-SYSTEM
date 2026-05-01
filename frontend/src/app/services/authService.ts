import { apiRequest } from "./api";

export type UserRole = "admin" | "employee";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export function loginUser(data: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/login", "POST", data);
}

export function signupUser(data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}) {
  return apiRequest<AuthResponse>("/signup", "POST", data);
}

export function saveSession(response: AuthResponse) {
  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user));
}

export function getCurrentUser(): AuthUser | null {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
