// Importing modules
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Importing functions
const keys = require("./src/keypair-generator/generator");
const createApp = require("./src/app-generator/createApp");
const updateApp = require("./src/app-generator/updateApp");
const scopeUpdate = require("./src/app-generator/scopeUpdate");
const getToken = require("./src/access-token-generator/GetAccessToken");
const getTokenO4O = require("./src/access-token-generator/GetAccessTokenO4O");

// Creating the UI
const recursiveAsyncReadLine1 = function () {
  rl.question(
    `
Please choose an action (numbers only):

1. Generate RSA Keypair
2. Application actions (Requires a generated keypair)
3. Get an Access Token (Requires a default authorization server)
4. Get an Access Token (O4O)
5. Exit

Option: `,
    (option) => {
      switch (option) {
        // Generate the Keypairs
        case "1":
          keys.keypairGenerator().then(() => {
            recursiveAsyncReadLine1();
          })
          break;
        // Application actions menu
        case "2":
          const recursiveAsyncReadLine2 = function () {
            rl.question(
              `
Please choose an action (numbers only):

1. Create App
2. Update App
3. Grant a scope
4. Back

Option: `,
              (option) => {
                switch (option) {
                  // Create app
                  case "1":
                    rl.question(
                      `Enter the name of your client: `,
                      (name) => {
                        createApp.createServiceApp(name).then(() => {
                          recursiveAsyncReadLine2();
                        })
                      }
                    );
                  // Update app
                  case "2":
                    rl.question(
                      `Enter the clientId of your client: `,
                      (clientId) => {
                        rl.question(
                      `Enter the name of your client: `,
                          (clientName) => {
                            updateApp.updateServiceApp(clientId, clientName).then(() => {
                            recursiveAsyncReadLine2();
                        });
                      }
                        )
                })
                  // Grant a scope
                  case "3":
                    rl.question(`Enter the scope to grant: `, (name) => {
                      scopeUpdate.grantScope(name).then(() => {
                        recursiveAsyncReadLine2();
                      });
                    });
                  // Go to the main menu
                  case "4":
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
          rl.question(`Enter the scope to request (Only custom scopes will work): `, (name) => {
            getToken.GetAccessToken(name).then(() => {
              recursiveAsyncReadLine1()
            })
          });
          break;
        case "4":
          rl.question(`Enter the O4O scope to request (Required): `, (name) => {
            getTokenO4O.GetAccessTokenO4O(name).then(() => {
              recursiveAsyncReadLine1()
            })
          });
          break;
        case "5":
          rl.close();
      }
    }
  );
};
// Calling the function to open the main menu
recursiveAsyncReadLine1();