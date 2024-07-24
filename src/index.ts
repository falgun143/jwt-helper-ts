import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

interface DecodeResult {
  id: string;
  payload: object;
  expires_at: Date;
}

export function encode_jwt(secret: string, id: string | number, payload: object, ttl?: number): string {
  const options: SignOptions = ttl ? { expiresIn: ttl } : {};
  const tokenPayload = { id, ...payload };
  const token=jwt.sign(tokenPayload, secret, options);
  return token;
}

export function decode_jwt(secret: string, token: string): DecodeResult {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  if (typeof decoded === "string" || !decoded.id || !decoded.exp) {
    throw new Error("Invalid token");
  }
  return {
    id: decoded.id,
    payload: decoded,
    expires_at: new Date(decoded.exp * 1000),
  };
}

export function validate_jwt(secret: string, token: string): boolean {
  try {
    const decoded = decode_jwt(secret, token);
    return decoded.expires_at > new Date();
  } catch (error) {
    return false;
  }
}
