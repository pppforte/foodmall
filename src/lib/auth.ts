import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { cookies } from 'next/headers';
import { getSettings } from '@/lib/settings';

const COOKIE_NAME = 'admin_token';

export async function verifyPassword(password: string): Promise<boolean> {
  const settings = await getSettings();
  if (settings.adminPasswordHash) {
    return bcryptjs.compare(password, settings.adminPasswordHash);
  }
  // Fallback: plain text comparison (first-time setup only)
  return password === (process.env.ADMIN_PASSWORD || 'admin123');
}

export async function verifyUsername(username: string): Promise<boolean> {
  const settings = await getSettings();
  return username === settings.adminUsername;
}

export async function generateToken(): Promise<string> {
  const settings = await getSettings();
  const secret = settings.jwtSecret || process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ role: 'admin' }, secret, { expiresIn: '24h' });
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const settings = await getSettings();
    const secret = settings.jwtSecret || process.env.JWT_SECRET || 'fallback-secret';
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function getTokenCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  };
}
