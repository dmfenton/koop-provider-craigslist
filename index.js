// the name of provider is used by koop to help build default routes for FeatureService and a preview
const pkg = require('./package.json')
const provider = {
  plugin_name: 'craigslist',
  hosts: false,
  controller: require('./controllers'),
  model: require('./models/craigslist'),
  routes: require('./routes'),
  status: {
    version: pkg.version
  },
  type: 'provider'
}

module.exports = provider
