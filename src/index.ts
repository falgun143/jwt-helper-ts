import {
  base64UrlEncode,
  base64UrlDecode,
  stringToUtf8,
  uint8ArrayToString,
} from "./utils";
import hmac from "./hmac";

interface JwtPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  aud?: string;
  iss?: string;
}

function createHeader() {
  return { alg: "HS256", typ: "JWT" };
}

export function encode_jwt(
  secret: string,
  id: string | number,
  payload: JwtPayload,
  ttl?: number
): string {
  const header = createHeader();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (ttl === undefined) {
    payload.exp = currentTimestamp + 60 * 60; // If ttl is not mentioned then by default it is set to 1 hour(3600 seconds)
  } else {
    payload.exp = currentTimestamp + ttl;
  }

  payload.iat = currentTimestamp;
  const payloadwithId = { id, ...payload };
  const headerEncoded = base64UrlEncode(stringToUtf8(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(
    stringToUtf8(JSON.stringify(payloadwithId))
  );

  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = hmac(secret, stringToUtf8(signatureInput));
  const signatureEncoded = base64UrlEncode(signature);

  return `${signatureInput}.${signatureEncoded}`;
}

export function decode_jwt(
  secret: string,
  jwt: string
): { id: string | number; payload: JwtPayload; exp: number } {
  const [headerEncoded, payloadEncoded, signatureEncoded] = jwt.split(".");

  if (!headerEncoded || !payloadEncoded || !signatureEncoded) {
    throw new Error("Invalid JWT");
  }

  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const expectedSignature = hmac(secret, stringToUtf8(signatureInput));
  const expectedSignatureEncoded = base64UrlEncode(expectedSignature);

  if (signatureEncoded !== expectedSignatureEncoded) {
    throw new Error("Invalid signature");
  }

  const payloadString = uint8ArrayToString(base64UrlDecode(payloadEncoded));
  const payload = JSON.parse(payloadString);

  const { id = null, exp = null, ...payloadWithoutExpAndID } = payload;

  return {
    id,
    payload: payloadWithoutExpAndID,
    exp,
  };
}

export function validate_jwt(secret: string, jwt: string): boolean {
  try {
    const { exp } = decode_jwt(secret, jwt);

    if (exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
