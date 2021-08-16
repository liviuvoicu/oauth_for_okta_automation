// Importing modules
const Keypairs = require("keypairs");
const fs = require("fs");

// Generate a new keypair as JWK
Keypairs.generate({
  kty: "RSA",
  modulusLength: 2048,
}).then(function (pair) {
  // Write JSON payload to create the API Services app
  fs.writeFileSync(
    "publicJWK.json",
    `{
        "client_name": "API Service App",
        "response_types": [
            "token"
        ],
        "grant_types": [
            "client_credentials"
        ],
        "token_endpoint_auth_method": "private_key_jwt",
        "application_type": "service",
        "jwks": {
            "keys": [
                ${JSON.stringify(pair.public, null, 2)}
            ]
        }
}`,
    {
      encoding: "utf8",
      flag: "w",
    }
  );
  // Print the Private Key JWK
  console.log(
    `
    /---PRIVATE JWK---/
    `,
    pair.private
  );
  // Print the Public Key JWK
  console.log(
    `
  /---PUBLIC JWK---/
  `,
    pair.public
  );

  //JWK to PEM
  return Keypairs.export({
    jwk: pair.private,
    format: "pkcs8",
  }).then(function (pem) {
    // Print the Private Key and write to file
    console.log(pem);
    fs.writeFileSync("private.key", pem, { encoding: "utf8", flag: "w" });
  });
});
