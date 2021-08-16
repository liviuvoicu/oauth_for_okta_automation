const app_response = require("./App_API.json");

let variables = {
  token: "API_TOKEN",
  url: "https://{yourDomain}",
  client_id: `${app_response["client_id"]}`,
  scope: "O4O Scope",
};

exports.variables = variables;
