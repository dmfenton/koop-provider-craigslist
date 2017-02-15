'use strict'
const ttl = 60 * 60
const request = require('request').defaults({gzip: true})
const types = require('./mappings/types.js')
module.exports = function (koop) {
  // This is our one public function it's job its to fetch data from craigslist and return as a feature collection
  this.getData = function (req, callback) {
    const key = `craigslist::${req.params.host}::${req.params.id}`
    koop.cache.retrieve(key, req.query, (err, geojson) => {
      if (geojson) {
        if (Date.now() > geojson.metadata.expires) this.fetchAndCache(key, req.params, callback)
        else callback(null, geojson)
      } else {
        this.fetchAndCache(key, req.params, callback)
      }
    })
  }

  this.fetchAndCache = function (key, options, callback) {
    fetch(options.host, options.id, (err, geojson) => {
      callback(err, geojson)
      // allow to live in cache for 1 hour
      koop.cache.upsert(key, geojson, { ttl })
    })
  }
}

function fetch (city, type, callback) {
  request(`https://${city}.craigslist.org/jsonsearch/${types[type]}/`, (err, res, body) => {
    if (err) return callback(err)
    const apartments = translate(res.body)
    apartments.metadata = {
      name: `${city} ${type}`,
      description: `Craigslist ${type} listings proxied by https://github.com/dmfenton/koop-provider-craigslist`
    }
    callback(null, apartments)
  })
}

// Map accross all elements from a Craigslist respsonse and translate it into a feature collection
function translate (data) {
  const list = JSON.parse(data)
  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  }
  if (list && list[0]) {
    const apartments = list[0].filter(node => { return node.Ask })
    featureCollection.features = apartments.map(formatFeature)
  }
  return featureCollection
}

// This function takes a single element from the craigslist response and translates it to GeoJSON
// TODO format based on schema types for other craiglists things like jobs
function formatFeature (apt) {
  const feature =  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [apt.Longitude, apt.Latitude]
    },
    properties: {
      title: apt.PostingTitle,
      price: parseFloat(apt.Ask),
      bedrooms: parseFloat(apt.Bedrooms),
      postDate: dateFormat(apt.PostedDate),
      posting: 'https:' + apt.PostingURL,
      thumbnail: apt.ImageThumb
    }
  }
 if (!isNaN(feature.properties.price) && !isNaN(feature.properties.bedrooms)) {
   const ppbr = feature.properties.price / feature.properties.bedrooms
   if (ppbr !== 0 && ppbr !== Infinity) feature.properties.pricePerBedroom = ppbr
 }
 return feature
}

function dateFormat (date) {
  return new Date(parseInt(date, 10) * 1000).toISOString()
}
