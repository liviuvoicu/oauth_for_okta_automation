// Importing modules
const Keypairs = require("keypairs");
const fs = require("fs");
const va = require("./variables");

// Generate a new keypair as JWK
Keypairs.generate({
  kty: "RSA",
  modulusLength: 2048,
}).then(function (pair) {
  // Write JSON payload to create the API Services app
  fs.writeFileSync(
    "AppRequest.json",
    `{
        "client_name": "${va.variables.appName}",
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

  console.log(`
                     ______________________________________________________________
                    |                                                              |
                    | Private Key and Public Key have been generated successfully! |
                    |______________________________________________________________|`);

  // Writing the JWK Private Key
  fs.writeFileSync(
    "./keys/privateJWK.json",
    JSON.stringify(pair.private, null, 2),
    {
      encoding: "utf8",
      flag: "w",
    }
  );
  // Writing the JWK Public Key
  fs.writeFileSync(
    "./keys/publicJWK.json",
    JSON.stringify(pair.public, null, 2),
    { encoding: "utf8", flag: "w" }
  );

  //JWK to PEM
  return (
    Keypairs.export({
      jwk: pair.private,
      format: "pkcs8",
    }).then(function (pem1) {
      // Write the Private Key to private.key
      fs.writeFileSync("./keys/privatePEM.key", pem1, {
        encoding: "utf8",
        flag: "w",
      });
    }),
    Keypairs.export({
      jwk: pair.public,
      format: "pkcs1",
    }).then(function (pem2) {
      // Write the Public Key to public.key
      fs.writeFileSync("./keys/publicPEM.key", pem2, {
        encoding: "utf8",
        flag: "w",
      });
    })
  );
});
