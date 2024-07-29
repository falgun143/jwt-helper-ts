![JWT](https://ik.imagekit.io/ably/ghost/prod/2019/05/Screenshot-2019-05-14-at-13.53.46.png?tr=w-1728,q-50)

# JWT Library

A TypeScript library for encoding, decoding and validating JSON Web Tokens (JWTs) using the HS256 algorithm. This library includes functionality for encoding JWTs with a specified payload and secret, decoding JWTs to extract their contents, and validating JWTs.

## Features

- Encode JWTs with HS256 algorithm
- Decode JWTs and extract payload and header
- Validate JWTs
- Support for customizable payload expiration
- Supports both ES Modules and CommonJS modules


## Installation
You can install this library via npm:

```bash
npm i @falgunpal/jwt-helper-ts
```

## Usage
### Encoding a JWT
To create a JWT, use the encode_jwt function:
```ts
import { encode_jwt } from "@falgunpaljwt-helper-ts";
const secret = 'your-secret';
const id = 1;
const payload = { name: 'John Doe' };
const ttl = 3600; // Optional, in seconds

const token = encode_jwt(secret, id, payload, ttl);
console.log('Generated Token:', token);
```

### Decoding a JWT

To decode a JWT, use the decode_jwt function:
```ts
import { decode_jwt } from '@falgunpaljwt-helper-ts';

const secret = 'your-secret';
const token = 'your-jwt-token';

const decoded = decode_jwt(secret, token);
console.log('Decoded JWT:', decoded);
```
### Validating a JWT
To validate a JWT, use the validate_jwt function:
```ts
import { validate_jwt } from  '@falgunpaljwt-helper-ts';

const secret = 'your-secret';
const token = 'your-jwt-token';

const isValid = validate_jwt(secret, token);
console.log('Is Token Valid?', isValid);
```

## Module System Support
This package supports both ECMAScript Modules (ESM) and CommonJS (CJS) module configurations. You can import and use the functions based on your module system preference.

### ESM Usage
If you're using ESM:
``` ts
import { encode_jwt, decode_jwt, validate_jwt } from 'jwt-helper';
```

### CJS Usage
If you're using CommonJS:
```ts
const { encode_jwt, decode_jwt, validate_jwt } = require('jwt-helper');
```
## Testing
The library includes tests for its core functionality. To run the tests, use:
```bash
npm test
```
