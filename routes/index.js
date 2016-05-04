module.exports = {
  'get /craiglist': 'index',
  'get /craiglist/apartments/:city/FeatureServer': 'featureServer',
  'get /craiglist/apartments/:city/FeatureServer/:layer': 'featureServer',
  'get /craiglist/apartments/:city/FeatureServer/:layer/:method': 'featureServer',
  'post /craiglist/apartments/:city/FeatureServer/:layer/:method': 'featureServer'
}
