# OAuth For Okta Automation Sample
 
This project has been created for whoever wants to troubleshoot O4O (OAuth for Okta) issues and doesn't yet have an application to do so.

## NOTE!

###### Please make sure that you're running the latest version of NPM, otherwise installing the dependencies will not work

```
npm install -g npm@latest
```

## Installing dependencies

```
npm install
```

## Setting up the required variables

###### In the main folder, please edit the 'config.js' file, where you will need an API Token that you can create under **Security > API > Token**, as well as your base URL e.g: https://acme.okta.com

## Running the application

###### 1) Run index.js with ```node index.js```. 
###### 2) Generate the keypairs necessary to create the API Services application (You can also copy the public JWK under **/src/keypair-generator/keys** and use the JSON body to update an existing application in your end).
###### 3) Create the application and enter a name for it
###### 4) Grant a scope of your choice (Arrays of scopes are not yet supported in the script, but it will be added in the near future)
###### 5) Get the Access Token
###### 6) With Postman or any other application to call APIs (even cURL), use the Access Token received within the Authorization header of your request with the value ```Bearer {AccessToken}```

Some bugs may still be present, but once I have time, I'll go over the code to optimize the size of the script and optimize the code.
