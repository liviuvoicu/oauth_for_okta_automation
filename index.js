// Importing modules
const njwt = require("njwt");
const fetch = require("node-fetch");
const fs = require("fs");
const va = require("./variables");

// Private Key needed to create the JWT private Key
const privateKey = `${fs.readFileSync("private.key", "utf8")}`;

//Variables to define in the JWT private Key
const clientId = va.variables.client_id;
const now = Math.floor(new Date().getTime() / 1000);
const plus5Minutes = new Date((now + 5 * 60) * 1000);
const alg = "RS256";

const claims = {
  aud: `${va.variables.url}/oauth2/v1/token`, // audience
};

// Creating the JWT private Key
const jwt = njwt
  .create(claims, privateKey, alg)
  .setIssuedAt(now)
  .setExpiration(plus5Minutes)
  .setIssuer(clientId)
  .setSubject(clientId)
  .compact();

console.log(jwt);

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

// Calling the above function
fetchAPI();
