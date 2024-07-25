import sha256 from './sha256';
import { stringToUtf8, uint8ArrayAppend } from './utils';

export default function hmac(secret: string, message: Uint8Array): Uint8Array {
    const blockSize = 64; // Block size in bytes
    const opad = new Uint8Array(blockSize).fill(0x5c);
    const ipad = new Uint8Array(blockSize).fill(0x36);

    const key = stringToUtf8(secret);
    let actualKey = key.length > blockSize ? sha256(key) : key;

    if (actualKey.length < blockSize) {
        const paddedKey = new Uint8Array(blockSize);
        paddedKey.set(actualKey);
        actualKey = paddedKey;
    }

    const oKeyPad = opad.map((b, i) => b ^ actualKey[i]);
    const iKeyPad = ipad.map((b, i) => b ^ actualKey[i]);

    const innerHash = sha256(uint8ArrayAppend(iKeyPad, message));
    return sha256(uint8ArrayAppend(oKeyPad, innerHash));
}
