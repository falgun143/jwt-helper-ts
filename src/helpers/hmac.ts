import { uint8ArrayAppend as append, stringToUtf8 } from './utils';

export default function hmac(
  hashFn: (data: Uint8Array) => Uint8Array,
  blockSizeBits: number,
  secret: string,
  message: Uint8Array,
  returnBytes: boolean
): Uint8Array {
  if (!(message instanceof Uint8Array)) {
    throw new Error('message must be of Uint8Array');
  }

  const blockSizeBytes = blockSizeBits / 8;

  const ipad = new Uint8Array(blockSizeBytes);
  const opad = new Uint8Array(blockSizeBytes);
  ipad.fill(0x36);
  opad.fill(0x5c);

  const secretBytes = stringToUtf8(secret);
  let paddedSecret: Uint8Array;
  if (secretBytes.length <= blockSizeBytes) {
    const diff = blockSizeBytes - secretBytes.length;
    paddedSecret = new Uint8Array(blockSizeBytes);
    paddedSecret.set(secretBytes);
  } else {
    paddedSecret = hashFn(secretBytes);
  }

  const ipadSecret = ipad.map((value, index) => {
    return value ^ paddedSecret[index];
  });
  const opadSecret = opad.map((value, index) => {
    return value ^ paddedSecret[index];
  });

  // HMAC(message) = H(K' XOR opad || H(K' XOR ipad || message))
  const innerHash = hashFn(append(ipadSecret, message));
  const outerHash = hashFn(append(opadSecret, innerHash));

  return returnBytes ? outerHash : new Uint8Array(outerHash);
}

