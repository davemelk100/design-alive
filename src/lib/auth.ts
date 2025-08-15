import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface MagicLinkPayload {
  email: string;
  token: string;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
};

export const extractTokenFromHeader = (
  authorization: string | undefined
): string | null => {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }
  return authorization.substring(7);
};

export const generateMagicLinkToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const generateMagicLinkPayload = (
  email: string,
  token: string
): MagicLinkPayload => {
  return { email, token };
};

export const verifyMagicLinkPayload = (payload: MagicLinkPayload): boolean => {
  return !!(payload.email && payload.token);
};
