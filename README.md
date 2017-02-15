# Koop-Craiglists
## A provider for the Craigslist Apartment search API

## How to use

You can use this as a plugin to an existing Koop server or use the default server or docker implementations.

## API

All data can be accessed at `http://adapters.koopernetes.com/craigslist/:city/:type/FeatureServer/0`

Cities follow the url subdomain for Craigslist (https://washingtondc.craigslist.org/)

e.g.
- washingtondc
- philadelphia
- baltimore

Types:
- apartments
- jobs
- forsale
- services
- gigs
- community

### Server
1. Go into /server and run `npm install`
2. Run `npm start`

### Docker
1. From the project root
1. `npm run docker-build` or `docker build -t koop-provider-yelp .`
1. `npm run docker-start` or `docker run -it -p 8080:8080 koop-provider-yelp`

### In an existing Koop Server
```js
//clean shutdown
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

// Initialize Koop
const Koop = require('koop')
const koop = new Koop()

// Install the craigslist Provider
const yelp = require('koop-craigslist')
koop.register(yelp)

// Start listening for http traffic
const config = require('config')
const port = config.port || 8080
koop.server.listen(port)
console.log(`Koop Yelp listening on ${port}`)
```
