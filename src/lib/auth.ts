import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "vakeel-session";
export const ROLE_COOKIE = "vakeel-role";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

type TokenPayload = {
  sub: string;
  role: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(payload: TokenPayload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  try {
    return jwt.sign(payload as any, JWT_SECRET, { expiresIn: "2d" });
  } catch (err) {
    throw err;
  }
}

export function setAuthCookies(response: NextResponse, token: string, role: string) {
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction, // only secure in production
    maxAge: 60 * 60 * 24 * 2,
    path: "/",
  });
  response.cookies.set(ROLE_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 2,
    path: "/",
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  response.cookies.set(ROLE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
