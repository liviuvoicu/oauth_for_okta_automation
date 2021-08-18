// Importing modules
const Keypairs = require("keypairs");
const fetch = require("node-fetch");
const va = require("./variables");
const private_keypair = require("./keys/privateJWK.json");

//Variables to define in the JWT private Key
const clientId = va.variables.client_id;
const aud = `${va.variables.url}/oauth2/v1/token`; // audience

// Creating the JWT Private Key
return Keypairs.signJwt({
  jwk: private_keypair,
  iss: clientId,
  exp: "5m",
  claims: { aud: aud, sub: clientId },
}).then(function (jwt) {
  // Body of the request to the API Services app to get the Access Token
  var rBody = {
    grant_type: "client_credentials",
    scope: `${va.variables.scope}`,
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
  const fetchAPI = async () => {
    const response = await fetch(
      `${va.variables.url}/oauth2/v1/token?` + formBody,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );
    const rJSON = await response.json();
    console.log(rJSON);
  };
  // Calling the above function (will remove later)
  fetchAPI();
});
