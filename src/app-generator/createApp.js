// Importing modules
const fetch = require("node-fetch");
const fs = require("fs");
const cfg = require("../../config");

module.exports = {
  createServiceApp: async function (appName) {
    // Call the API to create the application
    const createApp = () => {
      const app_request = require("../keypair-generator/keys/publicJWK.json");
      fetch(`${cfg.config.url}/oauth2/v1/clients`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `SSWS ${cfg.config.token}`,
        },
        body: `{
          "client_name": "${appName}",
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
                  ${JSON.stringify(app_request, null, 2)}
              ]
          }
    }`,
      })
        .then((response) => response.json())
        .then((data) =>
          fs.writeFileSync(
            "./src/app-generator/AppResponse.json",
            JSON.stringify(data, null, 2),
            { encoding: "utf8", flag: "w" }
          )
        );
      // Print and write response to AppResponse.json in order to get the client_id (will be modified in a future release)
      console.log(`
The app has been created!
      `);
    };

    setTimeout(function wait() {
      createApp();
    }, 1000);
  },
};
