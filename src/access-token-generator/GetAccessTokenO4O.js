// Importing modules
const Keypairs = require("keypairs");
const fetch = require("node-fetch");

module.exports = {
  GetAccessTokenO4O: function () {
    // Importing the Private Key to sign the JWT
    const private_keypair = require("../keypair-generator/keys/privateJWK.json");
    // Importing some variables needed for this to work (clientId and URL)
    const cfg = require("../../config");
    const app_response = require("../app-generator/AppResponse.json");

    // Variables to define in the JWT private Key
    const clientId = app_response["client_id"];
    const aud = `${cfg.config.url}/oauth2/v1/token`; // audience

    // Signing the JWT
    return Keypairs.signJwt({
      jwk: private_keypair,
      iss: clientId,
      exp: "5m",
      claims: { aud: aud, sub: clientId },
    }).then(function (jwt) {
      // Body of the request to the API Services app to get the Access Token
      var rBody = {
        grant_type: "client_credentials",
        client_assertion_type:
          "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        client_assertion: jwt,
      };

      // URL Encoding the body
      var formBody = [];
      for (var property in rBody) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(rBody[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      // Calling the API to get the Access Token
      return new Promise(function(resolve) {
      const fetchAPI = async () => {
        const response = await fetch(
          `${cfg.config.url}/oauth2/v1/token?` + formBody,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
          }
        ).then((response) => response.json()).then((responseJSON) => {
          console.log(responseJSON)
          resolve(responseJSON)
        });
      };
      fetchAPI();
    });
  });
},
};
