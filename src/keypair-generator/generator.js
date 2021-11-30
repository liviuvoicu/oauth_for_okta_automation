// Importing modules
const Keypairs = require("keypairs");
const fs = require("fs");
const path = require("path");

// Generate a new keypair as JWK
module.exports = {
  keypairGenerator: function () {
    return new Promise(function(resolve) {
    Keypairs.generate({
      kty: "RSA",
      modulusLength: 2048,
    }).then(function (pair) {
      console.log(`
                     ______________________________________________________________
                    |                                                              |
                    | Private Key and Public Key have been generated successfully! |
                    |______________________________________________________________|
                    
                  `);
      
      // Writing the JWK Private Key
      fs.writeFileSync(
        path.resolve(__dirname, "./keys/privateJWK.json"),
        JSON.stringify(pair.private, null, 2),
        {
          encoding: "utf8",
          flag: "w",
        }
      );
      // Writing the JWK Public Key
      fs.writeFileSync(
        path.resolve(__dirname, "./keys/publicJWK.json"),
        JSON.stringify(pair.public, null, 2),
        { encoding: "utf8", flag: "w" }
      );
      resolve("Done")

      //JWK to PEM
      return (
        Keypairs.export({
          jwk: pair.private,
          format: "pkcs8",
        }).then(function (pem1) {
          // Write the Private Key to private.key
          fs.writeFileSync(
            path.resolve(__dirname, "./keys/privatePEM.key"),
            pem1,
            {
              encoding: "utf8",
              flag: "w",
            }
          );
        }),
        Keypairs.export({
          jwk: pair.public,
          format: "pkcs1",
        }).then(function (pem2) {
          // Write the Public Key to public.key
          fs.writeFileSync(
            path.resolve(__dirname, "./keys/publicPEM.key"),
            pem2,
            {
              encoding: "utf8",
              flag: "w",
            }
          );
        })
      ); 
    });
  })
  },
};
