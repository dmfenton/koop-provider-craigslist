module.exports = function (craigslist, createBaseController) {
  const controller = createBaseController()
  // helpful as a liveness check
  controller.index = function (req, res) {
    res.send('Hello Craigslist')
  }

  // use the shared code in the BaseController to create a feature service
  controller.featureServer = function (req, res) {
    const options = { city: req.params.city, type: req.params.type }
    options.cacheKey = cacheKey(req.params)
    // Fetch data from Craiglists's API and translate it into geojson
    craigslist.get(options, req.query, function (err, geojson) {
      if (err) return res.status(500).send(err)
      // we want to handle filtered and ordering on our own, so we tell Koop to skip these steps
      req.query.skipFilter = true
      req.query.skipOrder = true
      // hand things off to Koop's Feature Server controller
      controller.processFeatureServer(req, res, geojson)
    })
  }

  controller.drop = function (req, res) {
    craigslist.drop({ cacheKey: cacheKey(req.params) }, e => {
      if (e) res.status(500).json({error: e})
      else res.status(200).json({drop: true})
    })
  }

  // return the controller so it can be used by koop
  return controller
}

function cacheKey(params) {
  return `${params.type}:${params.city}`
}
