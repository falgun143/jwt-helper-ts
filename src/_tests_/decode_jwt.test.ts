import { decode_jwt } from "../index";

//Below tokens are valid for next 5 days(Starting from 25 Jul 2024, 8:34 PM) just for testing purposes.
test("After decoding JWT ,It must be an object", () => {
  const secret = "secret";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6MTcyMjM1MTQzMSwiaWF0IjoxNzIxOTE5NDMxfQ.mfw28H12CYB3dnD4mRJWuqwCKtvA5ljnFidhXVJXzBw";
  const check = decode_jwt(secret, token);
  expect(check).toEqual({
    id: 1,
    payload: { sub: "1234567890", name: "John Doe", iat: 1721919431 },
    expires_at: 1722351431,
  });
});

test("Decoding a JWT with incorrect secret should throw an error", () => {
  const secret = "wrongsecret";
  const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6MTcyMjM1MTQzMSwiaWF0IjoxNzIxOTE5NDMxfQ.mfw28H12CYB3dnD4mRJWuqwCKtvA5ljnFidhXVJXzBw";

  expect(() => decode_jwt(secret, token)).toThrow("Invalid signature");
});

test("Decoded object must have id, payload, and expires_at keys", () => {
    const secret = "secret";
    const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6MTcyMjM1MTQzMSwiaWF0IjoxNzIxOTE5NDMxfQ.mfw28H12CYB3dnD4mRJWuqwCKtvA5ljnFidhXVJXzBw";
    const check = decode_jwt(secret, token);
    expect(check).toHaveProperty("id");
    expect(check).toHaveProperty("payload");
    expect(check).toHaveProperty("expires_at");
  });

  test("Decoding a JWT with any one of the  missing field should throw an error", () => {
    const secret = "secret";
    // Below token has single dot implying one of the part is missing
    const token ="eyJpZCI6MSwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6MTcyMjM1MTQzMSwiaWF0IjoxNzIxOTE5NDMxfQ.mfw28H12CYB3dnD4mRJWuqwCKtvA5ljnFidhXVJXzBw";
    expect(() => decode_jwt(secret, token)).toThrow("Invalid JWT");
  });
  