# Watch Me Grow

A web app to enable early identification of autism in children by enabling parents to fill out surveys and analyse the results.

Give it a go! http://rhokaustralia.github.io/watch-me-grow

## Architecture
### Frontend
The app is built with angular and angular-material with angular conventions. Different screens in the app are
defined as self-contained feature dirs, each with their own html file, controller, stylesheet and routes. These
are joined together in app.js which injects all of them.

The frontend build uses Webpack to join everything together using CommonJS, and this builds our SASS and loads our
HTML too.

### Backend
The backend has been done as quickly and as simply as possible. It uses Amazon Cognito to store data for individual
users, and DailyCred to handle authentication via an OAuth-like mechanism.

At the time it was done Cognito didn't have its own way to authenticate users, so an AWS Lambda is used at login to
get the details that have come from DailyCred and associate them with a Cognito identity, then return the details
of that identity back to the front-end.

## To Setup
```
npm install
```

## To Run Locally
```
npm run dev
```

Open `localhost:8080/watch-me-grow` to use. Note that you'll still need an internet connection because the solution 
uses DailyCred and Cognito and there's no way to run these outside the cloud.

## To Build
```
npm run build
```