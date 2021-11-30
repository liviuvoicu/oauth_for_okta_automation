// Importing modules
const fs = require("fs");
const cfg = require("../../config");
const https = require("https");

module.exports = {
  updateServiceApp: function (clientId, clientName) {
      const app_request = require("../keypair-generator/keys/publicJWK.json");

      const data = JSON.stringify({
        client_id: clientId,
        client_name: clientName,
        client_uri: null,
        logo_uri: null,
        redirect_uris: [],
        response_types: ["token"],
        grant_types: ["client_credentials"],
        application_type: "service",
        jwks: {
          keys: [
            app_request
          ]
        }
      })

      const options = {
        hostname: cfg.config.url.includes('https') ? cfg.config.url.split('//')[1] : cfg.config.url,
        port: 443,
        port: 443,
        path: `/oauth2/v1/clients/${clientId}`,
        method: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `SSWS ${cfg.config.token}`
        }
      };

      return new Promise(function(resolve, reject) {
      const req = https.request(options, res => {
        let dataQueue = '';
          res.on('data', (d) => {
            dataQueue += d;
            if(res.statusCode == 200 || 204){
              console.log('\x1b[32m%s\x1b[0m',`
The app has been updated!
            `);
            fs.writeFileSync(
              "./src/app-generator/AppResponse.json",
              dataQueue,
              { encoding: "utf8", flag: "w" }
            );
            resolve(res);
            } else {
              console.log('\x1b[31m%s\x1b[0m',`
Something went wrong... Check AppResponse.json to see what happened.
            `)
            }
      })
      req.on('error', error => {
        reject(error);
      });
    })
    req.write(data);
    req.end();
  })
}};