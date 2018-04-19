'use strict';
// Cache configured time or 1 hour
const farmhash = require("farmhash")
const config = require('config');
const ttl = (config.craigslist && config.craigslist.ttl) || 60 * 60;
const request = require('request').defaults({ gzip: true });
const types = require('./mappings/types.js');

module.exports = function() {
  // This is our one public function it's job its to fetch data from craigslist and return as a feature collection
  this.getData = function(req, callback) {
    const city = req.params.host;
    const type = req.params.id;
    request(`https://${city}.craigslist.org/jsonsearch/${types[type]}/?map=1`, (err, res, body) => {
      if (err) return callback(err);
      const apartments = translate(res.body);
      apartments.ttl = ttl;
      apartments.metadata = {
        name: `${city} ${type}`,
        description: `Craigslist ${type} listings proxied by https://github.com/dmfenton/koop-provider-craigslist`,
        idField: 'featureId' // Informs FeatureServer and Winnow to use this field as an OBJECTID, should be unique integer <= 2147483647 
      };
      callback(null, apartments);
    });
  };
};

// Map accross all elements from a Craigslist respsonse and translate it into a feature collection
function translate(data) {
  const list = JSON.parse(data);
  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  };
  if (list && list[0]) {
    const apartments = list[0].filter(node => {
      return node.Ask;
    });
    featureCollection.features = apartments.map(formatFeature);
  }
  return featureCollection;
}

// This function takes a single element from the craigslist response and translates it to GeoJSON
// TODO format based on schema types for other craiglists things like jobs
function formatFeature(apt) {
  const feature = {
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
      posting: apt.PostingURL,
      thumbnail: apt.ImageThumb,
      featureId: transformId(apt.PostingID) // Transform the PostingID to an integer <= 2147483647
    }
  };
  if (!isNaN(feature.properties.price) && !isNaN(feature.properties.bedrooms)) {
    const ppbr = feature.properties.price / feature.properties.bedrooms;
    if (ppbr !== 0 && ppbr !== Infinity) feature.properties.pricePerBedroom = ppbr;
  }
  return feature;
}

function dateFormat(date) {
  return new Date(parseInt(date, 10) * 1000).toISOString();
}

/**
 * Create an ID that is an integer in range of 0 - 2147483647. Should be noted that
 * the scaling of unsigned 32-bit integers to a range of 0 - 2147483647 increases likely hood
 * that two different input receive the same output
 * @param {*} id 
 */
function transformId (id) {
    // Hash to 32 bit unsigned integer
    const hash = farmhash.hash32(id.toString());
    
    // Normalize to range of postive values of signed integer
    return Math.round((hash / 4294967295) * (2147483647))
}