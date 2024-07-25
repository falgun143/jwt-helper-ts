export function stringToUtf8(str: string): Uint8Array {
    const utf8str = unescape(encodeURIComponent(str));
    const result = new Uint8Array(utf8str.length);
    for (let i = 0; i < utf8str.length; i++) {
        result[i] = utf8str.charCodeAt(i);
    }
    return result;
}

export function base64UrlEncode(data: Uint8Array): string {
    let base64 = btoa(String.fromCharCode.apply(null, Array.from(data)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlDecode(base64: string): Uint8Array {
    const base64Str = base64.replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64Str);
    const result = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        result[i] = raw.charCodeAt(i);
    }
    return result;
}

export function uint8ArrayToString(arr: Uint8Array): string {
    return String.fromCharCode.apply(null, Array.from(arr));
}

export function uint8ArrayAppend(arr1: Uint8Array, arr2: Uint8Array): Uint8Array {
    const result = new Uint8Array(arr1.length + arr2.length);
    result.set(arr1);
    result.set(arr2, arr1.length);
    return result;
}
