// Importing modules
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Importing functions
const keys = require("./src/keypair-generator/generator");
const createApp = require("./src/app-generator/createApp");
const scopeUpdate = require("./src/app-generator/scopeUpdate");
const getToken = require("./src/access-token-generator/GetAccessToken");

// Creating the UI
const recursiveAsyncReadLine1 = function () {
  rl.question(
    `
Please choose an action (numbers only):

1. Generate RSA Keypair
2. Application actions (Requires a generated keypair)
3. Get an Access Token

Option: `,
    (option) => {
      switch (option) {
        // Generate the Keypairs
        case "1":
          keys.keypairGenerator();
          setTimeout(function waitOneSecond() {
            recursiveAsyncReadLine1();
          }, 1000);
          break;
        // Application actions menu
        case "2":
          const recursiveAsyncReadLine2 = function () {
            rl.question(
              `
Please choose an action (numbers only):

1. Create App
2. Grant a scope
3. Back

Option: `,
              (option) => {
                switch (option) {
                  // Create the app
                  case "1":
                    rl.question(
                      `Enter the name of your application: `,
                      (name) => {
                        createApp.createServiceApp(name);
                        setTimeout(function waitSecond() {
                          recursiveAsyncReadLine2();
                        }, 1500);
                      }
                    );
                  // Grant a scope
                  case "2":
                    rl.question(`Enter the scope to grant: `, (name) => {
                      scopeUpdate.grantScope(name);
                      setTimeout(function waitSecond() {
                        recursiveAsyncReadLine2();
                      }, 3500);
                    });
                  // Go to the main menu
                  case "3":
                    recursiveAsyncReadLine1();
                }
              }
            );
          };
          // Calling the function to open the application actions menu
          recursiveAsyncReadLine2();
          break;
        // Generate the Access Token
        case "3":
          rl.question(`Enter the scope to request: `, (name) => {
            getToken.GetAccessToken(name);
            setTimeout(function waitSecond() {
              recursiveAsyncReadLine1();
            }, 1500);
          });
      }
    }
  );
};
// Calling the function to open the main menu
recursiveAsyncReadLine1();
