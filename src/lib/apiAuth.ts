import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import { UserModel } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'vakeel-session';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'lawyer' | 'admin';
}

/**
 * Verify authentication for API routes
 * Returns the authenticated user or null if not authenticated
 */
export async function verifyAuth(request: NextRequest | Request): Promise<AuthenticatedUser | null> {
  try {
    // Get token from cookies
    let token: string | undefined;
    
    if ('cookies' in request && typeof request.cookies.get === 'function') {
      token = (request as NextRequest).cookies.get(SESSION_COOKIE)?.value;
    } else {
      // Fallback for standard Request object
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => c.split('='))
        );
        token = cookies[SESSION_COOKIE];
      }
    }

    if (!token) {
      return null;
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };

    // Fetch user from database
    await connectToDatabase();
    const user = await UserModel.findById(decoded.sub).lean().exec();

    if (!user) {
      return null;
    }

    return {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role as 'client' | 'lawyer' | 'admin',
    };
  } catch {
    return null;
  }
}

/**
 * Helper to return 401 Unauthorized response
 */
export function unauthorizedResponse(message = 'Authentication required') {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Helper to return 403 Forbidden response
 */
export function forbiddenResponse(message = 'Access denied') {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser, roles: string | string[]): boolean {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
}
