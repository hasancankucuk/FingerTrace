import { useAuthStore } from '@/store/useAuthStore';
import { httpRequest } from './http';
import type { AuthResponse } from '@/models/AuthResponse';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";


const API_BASE_URL = import.meta.env.VITE_APP_URL;

export const getToken = (): string | undefined => {
  return localStorage.getItem("access_token") || useAuthStore.getState().token || undefined;
};

export const registerUser = (email: string, password: string, name: string) =>
  httpRequest<AuthResponse>(`${API_BASE_URL}/register`, {
    method: 'POST',
    body: { email, password, name },
  });

export const loginUser = async (email: string, password: string, turnstileToken?: string) => {
  const payload: any = { email, password };
  if (turnstileToken) {
    payload.turnstile_token = turnstileToken;
  }
  const result = await httpRequest<{ uid?: string; access_token?: string; error?: string }>(
    `${API_BASE_URL}/login`,
    {
      method: 'POST',
      body: payload,
    }
  );

  if (result.access_token) {
    localStorage.setItem('access_token', result.access_token);
    useAuthStore.setState({ token: result.access_token });
  }

  return result;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const user = await httpRequest<{ email: string; name: string; phone: string }>(
    `${API_BASE_URL}/user`,
    { method: 'GET', token }
  );
  return user;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  useAuthStore.setState({ token: null, user: null });
};

export const updateUser = async (name: string, email: string, phone?: string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  return httpRequest<{ message: string }>(`${API_BASE_URL}/user`, {
    method: 'PUT',
    token,
    body: { name, email, phone },
  });
};

export const updateProfile = async (data: { name: string; email: string; phone: string }) => {
  const result = await updateUser(data.name, data.email, data.phone);
  if (result.message) {
    return data;
  }
  throw new Error("Failed to update profile");
};

export const deleteUser = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  return httpRequest<{ message: string }>(`${API_BASE_URL}/user`, {
    method: 'DELETE',
    token,
  });
};

export const resetPassword = (email: string) => {
  return httpRequest<{ message: string }>(`${API_BASE_URL}/forgot`, {
    method: 'POST',
    body: { email },
  });
};


export const sendPasswordResetEmails = async (email: string,) => {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: "https://fingertrace.app/login",
      handleCodeInApp: false
    });
    console.log(`Password reset email sent to: ${email}`);
    return {
      email,
      reset: true,
      message: "Password reset email sent successfully by Firebase"
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}