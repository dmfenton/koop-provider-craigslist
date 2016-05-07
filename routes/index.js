module.exports = {
  'get /craigslist': 'index',
  'get /craigslist/:type/:city/FeatureServer': 'featureServer',
  'get /craigslist/:type/:city/FeatureServer/:layer': 'featureServer',
  'get /craigslist/:type/:city/FeatureServer/:layer/:method': 'featureServer',
  'post /craigslist/:type/:city/FeatureServer/:layer/:method': 'featureServer',
  'get /craigslist/:type/:city/drop': 'drop'
}
