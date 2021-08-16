# Oauth For Okta Automation Sample
 
This project has been created for whoever wants to troubleshoot O4O issues and doesn't yet have an application to do so.

## Installing dependencies

```
npm install
```

## Adding your environment

###### In the folder, there will be a 'variables.js' file. Please open it and edit the API Token, URL and scope variables for the script to work properly

## Creating the key pairs (RS256)

```
node keypair-generator.js
```

## Creating the API Services App

```
node app-generator.js
```

## Creating the JWT Key and get the Access Token with the requested scope

```
node index.js
```

###### You can then run 'index.js' as many times as you want having the same scope. Additional scopes might either need for you to change the request method in 'app-generator.js' to PUT or by running the file to create a different application with a different scope.

###### I'm aware of some bugs and issues, but this was made in a hurry in case anyone might need it soon.
