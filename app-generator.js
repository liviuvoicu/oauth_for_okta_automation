// Importing modules
const fetch = require("node-fetch");
const fs = require("fs");
const va = require("./variables");
const sleep = require("sleep");

// Read the App's payload
const data = fs.readFileSync("AppRequest.json", "utf8");

const createServiceApp = async () => {
  // Call the API to create the application
  const createApp = await fetch(`${va.variables.url}/oauth2/v1/clients`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `SSWS ${va.variables.token}`,
    },
    body: data,
  });
  // Print and write response to App_API.json in order to get the client_id (will be modified in a future release)
  const rJSON = await createApp.json();
  console.log(rJSON);
  fs.writeFileSync("AppResponse.json", JSON.stringify(rJSON, null, 2), {
    encoding: "utf8",
    flag: "w",
  });

  // Wait for 2 seconds because of how long it takes for Okta to create the app and make the ID available
  // It also calls the API to grant the okta.read.users scope
  await sleep.msleep(2000);
  fetch(`${va.variables.url}/api/v1/apps/${rJSON["client_id"]}/grants`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `SSWS ${va.variables.token}`,
      "Cache-COntrol": "no-cache",
    },
    body: `{
          "scopeId": "${va.variables.scope}",
          "issuer": "${va.variables.url}"
      }`,
  });
};

createServiceApp();
