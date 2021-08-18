const app_response = require("./AppResponse.json");

let variables = {
  token: "API_TOKEN", // Security > API > Tokens
  url: "OKTA_DOMAIN", // https://acme.okta.com
  scope: "OAUTH_FOR_OKTA_SCOPE", // okta.users.read
  client_id: `${app_response["client_id"]}`,
};

exports.variables = variables;
