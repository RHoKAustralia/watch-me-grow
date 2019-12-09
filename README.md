# WatchMeGrow.care

A web app for early childhood testing for autism and developmental issues.

This uses firebase and mailgun - you'll need a paid account for both (but it's pretty cheap). I've put the instructions in below mainly for my own reference - the app isn't generic enough to just work out of the box outside of watchmegrow.care... but it could with a bit of work.

Note that nothing will actually work until the web app is sitting on an expected hostname, as specified in packages/common/site-specific-config.ts.

## Run in Dev
1. Run a database:
docker run --name watch-me-grow-postgres -p 5432:5432 -e POSTGRES_PASSWORD=admin -d postgres:11

## Setup

