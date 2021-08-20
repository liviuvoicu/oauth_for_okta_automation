// Importing modules
const fetch = require("node-fetch");
const fs = require("fs");
const va = require("./variables");
const sleep = require("sleep");
const app_response = require("./AppResponse.json");

// Read the App's payload
const data = fs.readFileSync("AppRequest.json", "utf8");

const createServiceApp = async () => {
  if (app_response["client_id"] === undefined) {
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
    // Print and write response to AppResponse.json in order to get the client_id (will be modified in a future release)
    const rJSON = await createApp.json();
    console.log(`
    
    The application has been created!
    
    `);
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
  } else if (app_response["client_id"] !== undefined) {
    // Copying the same code as above because I'm too tired to think of a logical way to not have to use this twice (Will go over this on the weekend)
    const grantScope = await fetch(
      `${va.variables.url}/api/v1/apps/${va.variables.client_id}/grants`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `SSWS ${va.variables.token}`,
          "Cache-Control": "no-cache",
        },
        body: `{
          "scopeId": "${va.variables.scope}",
          "issuer": "${va.variables.url}"
      }`,
      }
    );
    const grantScope_status = grantScope.status;
    switch (grantScope_status) {
      case 200:
        console.log(`Scope ${va.variables.scope} has been granted.`);
      case 400:
        console.log(`The scope requested has already been granted.`);
        break;
      default:
        console.log(
          `Something might be wrong with the configuration. Please check the System Logs.`
        );
    }
  }
};

createServiceApp();
