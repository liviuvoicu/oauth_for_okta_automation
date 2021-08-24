// Importing variables
const cfg = require("../../config");
const fetch = require("node-fetch");
module.exports = {
  grantScope: async function (scope) {
    const grantRequestFunc = () => {
      // Importing the Response of the app creation API to get the clientId
      const rJSON = require("./AppResponse.json");
      // Calling {url}/api/v1/apps/{clientId}/grants to grant a scope
      fetch(`${cfg.config.url}/api/v1/apps/${rJSON["client_id"]}/grants`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `SSWS ${cfg.config.token}`,
          "Cache-Control": "no-cache",
        },
        body: `{
        "scopeId": "${scope}",
        "issuer": "${cfg.config.url}"
    }`,
      }).then(function (response) {
        switch (response.status) {
          case 200:
            console.log(`
${scope} has been successfully granted.
            `);
            break;
          case 400:
            console.log(
              `
The scope doesn't exist or it has already been granted.
              `
            );
            break;
        }
      });
    };
    setTimeout(function wait() {
      grantRequestFunc();
    }, 1500);
  },
};
