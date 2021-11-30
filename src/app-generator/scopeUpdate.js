// Importing variables
const cfg = require("../../config");
const https = require("https");

module.exports = {
  grantScope: function (scope) {
      const rJSON = require("./AppResponse.json");

      let data = JSON.stringify({
        scopeId: scope,
        issuer: cfg.config.url.includes('https') ? cfg.config.url : 'https://'.concat(cfg.config.url)
      })

      const options = {
        hostname: cfg.config.url.includes('https') ? cfg.config.url.split('//')[1] : cfg.config.url,
        port: 443,
        path: `/api/v1/apps/${rJSON["client_id"]}/grants`,
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `SSWS ${cfg.config.token}`,
          "Cache-Control": "no-cache",
        }
      }

      return new Promise(function(resolve, reject) {
      const req = https.request(options, res => {
        let dataQueue = '';
          res.on('data', (d) => {
            dataQueue += d
            if(res.statusCode == 200) {
              console.log('\x1b[32m%s\x1b[0m',`
${scope} has been successfully granted.
              `);
              } else {
                console.log('\x1b[31m%s\x1b[0m',
                  `
The scope doesn't exist or it has already been granted.
                  `
                );
              };
              resolve(res);
          });
          req.on('error', error => {
            reject(error);
          });

          })
      req.write(data);
      req.end();
    });
  }
};
