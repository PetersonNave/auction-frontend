import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '@/types';

const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auction_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getCurrentUser(): User | null {
  const token = Cookies.get('auction_token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || payload.id || '',
      username: payload.username || payload.user || '',
      displayName: payload.displayName || payload.display_name || '',
    } as User;
  } catch (e) {
    return null;
  }
}

export default api;