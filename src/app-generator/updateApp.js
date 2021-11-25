// Importing modules
const fetch = require("node-fetch");
const fs = require("fs");
const cfg = require("../../config");

module.exports = {
  updateServiceApp: async function (clientId) {
    // Call the API to create the application
    const updateApp = () => {
      const app_request = require("../keypair-generator/keys/publicJWK.json");
      return new Promise(function(resolve) {
      fetch(`${cfg.config.url}/oauth2/v1/clients/${clientId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `SSWS ${cfg.config.token}`,
        },
        body: `
    {
            "client_id": "${clientId}",
            "client_name": "Test11",
            "client_uri": null,
            "logo_uri": null,
            "redirect_uris": [],
            "response_types": [
                "token"
            ],
            "grant_types": [
                "client_credentials"
            ],
          "jwks": {
              "keys": [
                  ${JSON.stringify(app_request, null, 2)}
              ]
          },
            "application_type": "service"
    }`,
      }).then((response) => response.json()).then((data) => {
          fs.writeFileSync(
            "./src/app-generator/AppResponse.json",
            JSON.stringify(data, null, 2),
            { encoding: "utf8", flag: "w" }
          ),
          console.log("The app has been updated!"),
          resolve(data)
      }
        );
    })
  };
  updateApp();
}};