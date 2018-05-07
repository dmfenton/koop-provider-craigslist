// the name of provider is used by koop to help build default routes for FeatureService and a preview
const pkg = require('./package.json')
module.exports = {
  name: 'craigslist',
  hosts: true,
  Model: require('./model'),
  version: pkg.version,
  type: 'provider',
  routes: require('./routes'), // Optional, any additional routes that should be handled by this provider
  Controller: require('./controller'), // Optional, a controller to support unique routes,
  middleware: require('./middleware')
}
