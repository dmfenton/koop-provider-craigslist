'use strict'
const request = require('request').defaults({gzip: true})
const types = require('../mappings/types.js')
module.exports = function (koop) {
  // This is our one public function it's job its to fetch data from craigslist and return as a feature collection
  this.get = function (options, query, callback) {
    koop.cache.get('craigslist', options.cacheKey, query, (err, entry) => {
      if (entry && entry[0]) {
        callback(null, entry[0])
      } else {
        fetch(options, (err, geojson) => {
          callback(err, geojson)
          koop.cache.insert('craigslist', options.cacheKey, geojson, 0, e => {
            if (e) console.trace(e)
          })
        })
      }
    })
  }

  this.drop = function (options, callback) {
    console.log(options, options.cacheKey)
    koop.cache.remove('craigslist', options.cacheKey, {layer: 0}, callback)
  }

  return this
}

function fetch (options, callback) {
  request(`https://${options.city}.craigslist.org/jsonsearch/${types[options.type]}/`, (err, res, body) => {
    if (err) return callback(err)
    const apartments = translate(res.body)
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
  return {
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
}

function dateFormat (date) {
  return new Date(parseInt(date, 10) * 1000).toISOString()
}
