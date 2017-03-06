//clean shutdown
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

// Initialize Koop
const Koop = require('koop')
const koop = new Koop()

// Install the Craigslist Provider
const craigslist = require('./')
koop.register(craigslist)

// Start listening for http traffic
const config = require('config')
const port = config.port || 80
koop.server.listen(port)

const message = `

Koop Craigslist is listening on ${port}

Try it out in your browswer: http://localhost:${port}/craigslist/atlanta/apartments/FeatureServer/0/query
Or on the command line: curl --silent http://localhost:${port}/craigslist/atlanta/apartments/FeatureServer/0/query?returnCountOnly=true

Press control + c to exit
`
console.log(message)
