'use strict'
const request = require('request').defaults({gzip: true})
module.exports = function (koop) {
  const craigslist = {}

  // This is our one public function it's job its to fetch data from craigslist and return as a feature collection
  craigslist.get = function (options, query, callback) {
    koop.cache.get('craigslist', 'apartments:dc', query, (err, entry) => {
      if (entry && entry[0]) {
        callback(null, entry[0])
      } else {
        fetch(options, (err, geojson) => {
          callback(err, geojson)
          koop.cache.insert('craigslist', 'apartments:dc', geojson, 0, e => {
            if (e) console.trace(e)
          })
        })
      }
    })
  }

  function fetch (options, callback) {
    request('https://washingtondc.craigslist.org/jsonsearch/apa/', (err, res, body) => {
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
      console.log(list[0])
      const apartments = list[0].filter(node => { return node.Ask })
      featureCollection.features = apartments.map(formatFeature)
    }
    return featureCollection
  }

  // This function takes a single element from the craigslist response and translates it to GeoJSON
  function formatFeature (apt) {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [apt.longitude, apt.latitude]
      },
      properties: {
        title: apt.PostingTitle,
        price: parseFloat(apt.Ask),
        bedrooms: apt.Bedrooms,
        postDate: apt.PostingDate,
        posting: 'https://' + apt.PostingUrl,
        thumbnail: apt.ImageThumb

      }
    }
  }
  return craigslist
}
