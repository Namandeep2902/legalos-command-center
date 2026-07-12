export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
}

const AUTH_KEY = "legalos_user";

export function getUser(): User | null {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/login";
}

export function getInitials(name: string): string {
  if (!name) return "US";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name.substring(0, 2)).toUpperCase();
}
