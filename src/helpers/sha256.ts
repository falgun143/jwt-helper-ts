const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
    0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
    0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
    0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
    0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function padMessage(message: Uint8Array): Uint32Array {
    const bitLength = message.length * 8;
    const fullLength = bitLength + 65;
    let paddedLength = (fullLength + (512 - fullLength % 512)) / 32;
    let padded = new Uint32Array(paddedLength);

    for (let i = 0; i < message.length; ++i) {
        padded[Math.floor(i / 4)] |= (message[i] << (24 - (i % 4) * 8));
    }

    padded[Math.floor(message.length / 4)] |= (0x80 << (24 - (message.length % 4) * 8));
    padded[padded.length - 1] = bitLength;

    return padded;
}

function rotr(x: number, n: number): number {
    return (x >>> n) | (x << (32 - n));
}

function ch(x: number, y: number, z: number): number {
    return (x & y) ^ (~x & z);
}

function maj(x: number, y: number, z: number): number {
    return (x & y) ^ (x & z) ^ (y & z);
}

function bsig0(x: number): number {
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}

function bsig1(x: number): number {
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}

function ssig0(x: number): number {
    return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
}

function ssig1(x: number): number {
    return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
}

export default function sha256(message: Uint8Array): Uint8Array {
    const h = Uint32Array.of(
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    );

    const padded = padMessage(message);
    const w = new Uint32Array(64);

    for (let i = 0; i < padded.length; i += 16) {
        for (let t = 0; t < 16; ++t) {
            w[t] = padded[i + t];
        }
        for (let t = 16; t < 64; ++t) {
            w[t] = (ssig1(w[t - 2]) + w[t - 7] + ssig0(w[t - 15]) + w[t - 16]) >>> 0;
        }

        let [a, b, c, d, e, f, g, h0] = h;

        for (let t = 0; t < 64; ++t) {
            const T1 = (h0 + bsig1(e) + ch(e, f, g) + k[t] + w[t]) >>> 0;
            const T2 = (bsig0(a) + maj(a, b, c)) >>> 0;
            h0 = g;
            g = f;
            f = e;
            e = (d + T1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (T1 + T2) >>> 0;
        }

        h[0] = (h[0] + a) >>> 0;
        h[1] = (h[1] + b) >>> 0;
        h[2] = (h[2] + c) >>> 0;
        h[3] = (h[3] + d) >>> 0;
        h[4] = (h[4] + e) >>> 0;
        h[5] = (h[5] + f) >>> 0;
        h[6] = (h[6] + g) >>> 0;
        h[7] = (h[7] + h0) >>> 0;
    }

    const result = new Uint8Array(h.length * 4);
    h.forEach((value, index) => {
        const i = index * 4;
        result[i] = (value >>> 24) & 0xff;
        result[i + 1] = (value >>> 16) & 0xff;
        result[i + 2] = (value >>> 8) & 0xff;
        result[i + 3] = value & 0xff;
    });

    return result;
}
