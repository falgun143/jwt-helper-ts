import sha256 from './helpers/sha256';
import hmac from './helpers/hmac';
import { base64UrlEncode, base64UrlDecode, stringToUtf8, uint8ArrayToString } from './helpers/utils';


export type JwtPayload = {
  [key: string]: any;
  aud?: string;
  iss?: string;
};

export type JwtPayloadWithClaims = JwtPayload & {
  exp: number;
  iat: number;
};

function createHeader(): object {
  return { alg: 'HS256', typ: 'JWT' };
}

export function encode_jwt(secret: string, id: string | number, payload: JwtPayload, ttl?: number): string {
  const header = createHeader();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (secret.length <= 0 || typeof payload !== 'object' || payload == null) {
    throw new Error('Invalid payload');
  }

  const payloadWithClaims: JwtPayloadWithClaims = {
    ...payload,
    exp: ttl === undefined ? currentTimestamp + 60 * 60 : currentTimestamp + ttl,
    iat: currentTimestamp,
  };

  const payloadWithId = { id, ...payloadWithClaims };
  const headerEncoded = base64UrlEncode(stringToUtf8(JSON.stringify(header)));
  const payloadEncoded = base64UrlEncode(stringToUtf8(JSON.stringify(payloadWithId)));

  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = hmac(sha256, 512, secret, stringToUtf8(signatureInput), true);
  const signatureEncoded = base64UrlEncode(signature);

  return `${signatureInput}.${signatureEncoded}`;
}

export function decode_jwt(secret: string, jwt: string): { id: string | number; payload: JwtPayload; expires_at: number} {
  const [headerEncoded, payloadEncoded, signatureEncoded] = jwt.split('.');

  if (!headerEncoded || !payloadEncoded || !signatureEncoded) {
    throw new Error('Invalid JWT');
  }

  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const expectedSignature = hmac(sha256, 512, secret, stringToUtf8(signatureInput), true);
  const expectedSignatureEncoded = base64UrlEncode(expectedSignature);

  if (signatureEncoded !== expectedSignatureEncoded) {
    throw new Error('Invalid signature');
  }

  const payloadString = uint8ArrayToString(base64UrlDecode(payloadEncoded));
  const payload = JSON.parse(payloadString);

  const { id=null, exp=null, ...payloadwithoutIdAndExp } = payload;

  return {
    id,
    payload: payloadwithoutIdAndExp,
    expires_at:exp,
  };
}

export function validate_jwt(secret: string, jwt: string): boolean {
  try {
    const { expires_at } = decode_jwt(secret, jwt);
    return expires_at > (Date.now() / 1000);
  } catch {
    return false;
  }
}
