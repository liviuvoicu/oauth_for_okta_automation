const app_response = require("./AppResponse.json");

let variables = {
  client_id: `${app_response["client_id"]}`,
};

exports.variables = variables;
