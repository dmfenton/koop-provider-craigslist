module.exports = {
  'get /craigslist': 'index',
  'get /craigslist/apartments/:city/FeatureServer': 'featureServer',
  'get /craigslist/apartments/:city/FeatureServer/:layer': 'featureServer',
  'get /craigslist/apartments/:city/FeatureServer/:layer/:method': 'featureServer',
  'post /craigslist/apartments/:city/FeatureServer/:layer/:method': 'featureServer',
  'get /craigslist/apartments/:city/drop': 'drop'
}
