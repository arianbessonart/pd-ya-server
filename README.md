
[![Build Status](https://travis-ci.org/arianbessonart/pd-ya-server.svg?branch=master)](https://travis-ci.org/arianbessonart/pd-ya-server)
[![Coverage Status](https://coveralls.io/repos/github/arianbessonart/pd-ya-server/badge.svg?branch=master)](https://coveralls.io/github/arianbessonart/pd-ya-server?branch=master)


## Pedidos Ya Backend evaluation

## Run

```
npm install
npm start
```

## Components

### HttpServer
Using **express**, a web application framework, to define different routes:
1. /auth/login
2. /auth/logout
3. /restaurants/find

### Authentication
The backend use Json Web Token standard for representing claims securely between app client and itself. It use token between two parties.

### Authorize api call
Others except login resource are verified on every call, looking up header parameter token.

In case this is not provided, server will return http code: 403 Forbidden.
```json
  {
    "success": false,
    "message": "No token provided"
  }
```
In case the token is invalid.
```json
  {
    "success": false,
    "message": "Failed to authenticate token"
  }
```

### Invoke external api
On startup it is necessary get external api service token, once got it, this token is store on a cache.


### Test
Use **mocha** framework with **should** as assertion library, and **mockery**, **nock**, **node-mocks-http** and **proxyquire** for mock the api calls, controllers call etc.
You can use the next command for run test:
```
  npm test
```

### Coverage
Use **istanbul** framework. You can use the next command for run test with coverage:
```
  npm run coverage
```

### Continuous Integration
Add continuous integration running test on every change. Add badge on top of README.

#### travis-ci
Plaform for running builds.

#### coveralls
Web service to track your code coverage.


### Sort Restaurants by Rating
Using **lodash** library for sort a dataset of Restaurants by theirs rating.
```javascript
  restaurants = _.orderBy(restaurants, ['ratingScore'], ['desc']);
```
Maybe this order could be on the database side, besides the sample is very small.

### Log
Use **winston** library. It is only configured for logging into the console.

### Config
Use a config file for every constant/variable like:
1. clientKey
  - clientId
  - clientSecret
2. apiUrl
  - base
  - prefix
3. jwt
  - secretKey
  - headerTokenField
