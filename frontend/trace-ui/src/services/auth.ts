import { useAuthStore } from '@/store/useAuthStore';
import { httpRequest } from './http';
import type { AuthResponse } from '@/models/AuthResponse';


export const getToken = (): string | undefined => {
  return localStorage.getItem("access_token") || useAuthStore.getState().token || undefined;
};

export const registerUser = (email: string, password: string, name: string) =>
  httpRequest<AuthResponse>('http://localhost:5000/register', {
    method: 'POST',
    body: { email, password, name },
  });

export const loginUser = async (email: string, password: string) => {
  const result = await httpRequest<{ uid?: string; access_token?: string; error?: string }>(
    'http://localhost:5000/login',
    {
      method: 'POST',
      body: { email, password },
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

  const user = await httpRequest<{ email: string; name: string; phone?: string }>(
    'http://localhost:5000/user',
    { method: 'GET', token }
  );
  return user;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  useAuthStore.setState({ token: null });
};

export const updateUser = async (name: string, email: string) => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  return httpRequest<{ message: string }>('http://localhost:5000/user', {
    method: 'PUT',
    token,
    body: { name, email },
  });
};

export const deleteUser = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  return httpRequest<{ message: string }>('http://localhost:5000/user', {
    method: 'DELETE',
    token,
  });
};

export const resetPassword = (email: string) => {
  return httpRequest<{ message: string }>('http://localhost:5000/forgot', {
    method: 'POST',
    body: { email },
  });
};