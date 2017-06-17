# Watch Me Grow

A web app for early childhood testing for autism and developmental issues.

To run:
```
npm install
npm run dev
```
Then open on localhost:8081.

To push a demoable copy:
```
npm run build
cd build
surge
```

How it works:
- Most of the app is static javascript
- It pushes the results to an AWS lambda
- The AWS lambda pushes to Zapier
- Zapier pushes to Google Sheets and to Drip.
