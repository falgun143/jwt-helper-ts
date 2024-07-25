import { Buffer } from 'buffer';

export function base64UrlEncode(input: Uint8Array): string {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlDecode(input: string): Uint8Array {
  const base64 = input
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(input.length + (4 - (input.length % 4)) % 4, '=');
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

export function stringToUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

export function uint8ArrayAppend(a: Uint8Array, b: Uint8Array): Uint8Array {
    if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
      throw new TypeError('expected Uint8Array');
    }
  
    const result = new Uint8Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
  
    return result;
  }
  
export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function b64(input: string): string {
  return Buffer.from(input).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function unb64(input: string): string {
  const base64 = input
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(input.length + (4 - (input.length % 4)) % 4, '=');
  return Buffer.from(base64, 'base64').toString();
}
