import { validate_jwt } from '../index'; // Adjust the path if needed

// Below tests are valid only within the ttl.
test('It should validate jwt if token is valid', () => {
  const secret = 'secret';
  const validJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzIxOTIxMDI5LCJpYXQiOjE3MjE5MTc0Mjl9.hQ0nYrGPoTP6ljXGYkzzPWxsvEtn_5eHWnP8rVyVqYA";
    const isValid = validate_jwt(secret, validJwt);
    expect(isValid).toBe(true); // or false based on your JWT's state
});

test('It should not validate jwt if token is invalid', () => {
  const secret = 'secret';
  const validJwt = 'eyJhbGciOiJIUzI1NiIdInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItaWQiLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNzIxOTE2OTk4LCJpYXQiOjE3MjE5MTMzOTh9.df1ASwdSCpPs7sqD-mGFhSah6kvgGD_ZTzRXo4U3kWU'; 
    const isValid = validate_jwt(secret, validJwt);
    expect(isValid).toBe(false); // or false based on your JWT's state
});
