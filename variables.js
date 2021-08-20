const app_response = require("./AppResponse.json");

let variables = {
  token: "API_TOKEN",
  url: "OKTA_DOMAIN",
  appName: "APP_NAME",
  scope: "O4O_SCOPE",
  client_id: `${app_response["client_id"]}`,
};

exports.variables = variables;
