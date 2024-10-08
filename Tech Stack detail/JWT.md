# JWT (JSON Web Token)

JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.

JWT.IO allows you to decode, verify and generate JWT.

> [!Warning]

> JWTs are credentials, which can grant access to resources. Be careful where you paste them! We do not record tokens, all validation and debugging is done on the client side.


 Method used for this project- 
 
 > ***sign() :*** 

 > This is method is used in _./models/user.model.js_

 >***verify() :***


# Usage

**jwt.sign(payload, secretOrPrivateKey, [options, callback])**

(Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.

(Synchronous) Returns the JsonWebToken as string

payload could be an object literal, buffer or string representing valid JSON.