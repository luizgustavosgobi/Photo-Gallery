import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { jwtVerify, JWTPayload } from 'jose';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

interface JwtUserPayload extends JWTPayload {
  id?: string;
  role?: string;
}

async function verifyCredentials(token: string): Promise<JwtUserPayload | null> {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    const secret = new TextEncoder().encode(jwtSecret);

    const { payload } = await jwtVerify(token, secret);
    if (!payload) return null;

    return payload as JwtUserPayload;
  } catch (err) {
    console.error('JWT verification failed in verifyCredentials middleware', err);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('session');

  if (!token) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response
  }

  const userData = await verifyCredentials(token.value);
  if (userData === null || userData.role !== Role.ADMIN)
    return NextResponse.redirect(new URL('/auth/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/admin/:path*',
    '/admin/:path*'
  ],
}