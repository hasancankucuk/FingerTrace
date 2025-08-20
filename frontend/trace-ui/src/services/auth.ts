import { useAuthStore } from "@/store/useAuthStore";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Registration failed");

    const { uid, access_token } = result as { uid?: string; access_token?: string };

    return { uid, access_token };
  } catch (error: any) {
    console.error("Register error:", error);
    throw new Error(error?.message || "Registration failed");
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result?.message || "Login failed");

    const { uid, access_token } = result as { uid?: string; access_token?: string };
    if (access_token) useAuthStore.setState({ token: access_token });

    return { uid, access_token };
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error?.message || "Login failed");
  }
};

export const getToken = () => useAuthStore.getState().token;

export const getAuthHeaders = () => {
  const token = getToken();
  const headers = new Headers({ "Content-Type": "application/json" });
  if (token) headers.append("Authorization", `Bearer ${token}`);
  return headers;
};

export const getCurrentUser = async () => {
  const headers = getAuthHeaders();
  const res = await fetch(`http://localhost:5000/user`, {  method: "GET", headers: headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Failed to fetch user");
  }
  return res.json();
};

export const logout = () => localStorage.removeItem("access_token");

export const updateUser = async (name: string, email: string) => {
  const headers = getAuthHeaders();
  const res = await fetch(`http://localhost:5000/user`, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Failed to update user");
  }
  return res.json();
};

export const deleteUser = async () => {
  const headers = getAuthHeaders();
  const res = await fetch(`http://localhost:5000/user`, {
    method: "DELETE",
    headers: headers,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Failed to delete user");
  }
  return res.json();
};


export const resetPassword = (email: string) => {
  return fetch(`http://localhost:5000/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};