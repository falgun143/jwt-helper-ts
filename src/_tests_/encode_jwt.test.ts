import { encode_jwt } from "../index";

test("Throws error for invalid payload", () => {
  expect(() => {
    encode_jwt("secret", 1, null as any);
  }).toThrow("Invalid payload");
});

test("Generates JWT token with default ttl and has a type of string", () => {
  const token = encode_jwt("secret", 1, { aud: "backend" });
  expect(typeof token).toBe("string");
});

test("Generates JWT token with provided ttl", () => {
  const token = encode_jwt("secret", 1, { iss: "jwt-helper" }, 120);
  expect(token).toBeDefined();
});

test("Generated token must have a length of 3",()=>{
  const token = encode_jwt("secret", 10, {"aud":"backend"});
  const arr=token.split(".");
  expect(arr.length).toBe(3)

})

