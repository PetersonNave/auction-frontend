import Cookies from 'js-cookie';
import { User } from '@/types';


function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const token = Cookies.get('auction_token');
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;

  return {
    id: payload.sub || payload.id || '',
    username: payload.username || payload.user || '',
    displayName: payload.displayName || payload.display_name || '',
  } as User;
}

export default { getCurrentUser };
