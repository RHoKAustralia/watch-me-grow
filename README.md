# WatchMeGrow.care

A web app for early childhood testing for autism and developmental issues.

This uses firebase and mailgun - you'll need a paid account for both (but it's pretty cheap). I've put the instructions in below mainly for my own reference - the app isn't generic enough to just work out of the box outside of watchmegrow.care... but it could with a bit of work.

Note that nothing will actually work until the web app is sitting on an expected hostname, as specified in packages/common/site-specific-config.ts.

## Setup
- Create a new firebase account - it can't be a free account because it needs to call out to mailgun
- Setup a firestore database with rules
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
  		allow read: if request.auth.token.admin == true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```
and an index on `results`, with `details.siteId` Ascending and `details.dobAsDate` Ascending.

- Follow the "Deploy to App Engine" instructions in /functions-cron to set up a Google Pubsub daily tick for the reminder emails. Stop following the instructions because we're going to deploy our own.
- Sign up for mailgun, get the API key
- If you haven't already, log into firebase `firebase login`
- Set your mailgun key in firebase config: `firebase --project YOUR_PROJECT_ID functions:config:set mailgun.apikey="YOUR_API_KEY"`
- Build everything: `lerna run build`
- `cd` into the `packages` dir and run `firebase deploy`
- If you want notification emails to be CC'd, specify CC: `firebase --project YOUR_PROJECT_ID functions:config:set notifyemail.cc="YOUR_API_KEY"`


