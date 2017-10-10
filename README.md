# Watch Me Grow

A web app for early childhood testing for autism and developmental issues.

## To run
```
npm install
npm run dev
```
Then open on localhost:8081.

## To build
```
npm run build
```
Then upload to S3.

To build the dubai version.
```
npm run build-dubai
```
Then upload to S3.

## How it works:
- Most of the app is static javascript
- It pushes the results to an AWS lambda (lambda/wmg-email)
- The AWS lambda pushes to Zapier and to Mailgun
  - Mailgun sends emails to parent and doctor
  - Mailgun also records a reminder date against the subscriber
- Zapier pushes to Google Sheets 

## How reminders work:
- A lambda (lambda/reminder-cron) wakes up every day, gets the full ( :( ) list of subscribers
  from mailgun, sees if any need to be reminded today, reminds them via mailgun if so.

## To build lambdas
(in lambda directory)
```
rm -rf node_modules/wmg-common
npm install
./create-archive.sh
```

Then upload `archive.zip` to lambda as ZIP.
