// Importing modules
const Keypairs = require("keypairs");
const https = require("https");

module.exports = {
  GetAccessToken: function (scope) {
    // Importing the Private Key to sign the JWT
    const private_keypair = require("../keypair-generator/keys/privateJWK.json");
    // Importing some variables needed for this to work (clientId and URL)
    const cfg = require("../../config");
    const app_response = require("../app-generator/AppResponse.json");

    // Variables to define in the JWT private Key
    const clientId = app_response["client_id"];
    const aud = `${cfg.config.url.includes('https') ? cfg.config.url : 'https://'.concat(cfg.config.url)}/oauth2/default/v1/token`; // audience

    // Signing the JWT
    return Keypairs.signJwt({
      jwk: private_keypair,
      iss: clientId,
      exp: "5m", // This is the expiration time if you want to change it for some reason (doesn't affect the expiration time of the token received from Okta)
      claims: { aud: aud, sub: clientId },
    }).then(function (jwt) {

      let reqBody = {
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: jwt,
        scope: scope
      };

      // URL Encoding the body
      let formBody = [];
      for (let property in reqBody) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(reqBody[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      const options = {
        hostname: cfg.config.url.includes('https') ? cfg.config.url.split('//')[1] : cfg.config.url,
        port: 443,
        path: '/oauth2/default/v1/token?' + formBody,
        method: 'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        }
      };

      // Calling the API to get the Access Token
      return new Promise(function (resolve, reject) {
        const req = https.request(options, res => {
          let dataQueue = '';
          res.on('data', (d) => {
            dataQueue += d
          });

          res.on('end', () => {
            expiry1 = dataQueue.split('in":');
            expiry2 = expiry1[1].split(',"access');
            console.log('\x1b[32m%s\x1b[0m', `\nExpires in: ${expiry2[0]}s\n`);
            token1 = expiry2[1].split('token":"');
            token2 = token1[1].split('","');
            console.log('\x1b[32m%s\x1b[0m', `Token: ${token2[0]}\n`);
            scope1 = token2[1].split(':"');
            scope2 = scope1[1].split('"}');
            console.log('\x1b[32m%s\x1b[0m', `Scopes: ${scope2[0]}\n`)
            resolve(res);
          })

          req.on('error', error => {
            reject(error);
          });
        });
        req.end();
      });
    });
  }
};