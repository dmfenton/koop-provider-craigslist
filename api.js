import Model from './model'
import FeatureServer from 'featureserver'
const model = new Model()

export function fsG () { }
fsG.api = {
  path: 'craigslist/{city}/{type}/FeatureServer',
  responseContentType: 'application/json'
}

export function fsP () { }
fsP.api = {
  path: 'craigslist/{city}/{type}/FeatureServer',
  method: 'POST',
  responseContentType: 'application/json'
}

export function layerG () {}
layerG.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/{layer}',
  responseContentType: 'application/json'
}

export function layerP () {}
layerP.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/{layer}',
  method: 'POST',
  responseContentType: 'application/json'
}

export function methodG () {}
methodG.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/{layer}/{method}',
  responseContentType: 'application/json'
}

export function methodP () {}
methodP.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/{layer}/{method}',
  method: 'POST',
  responseContentType: 'application/json'
}

export function layersG () {}
layersG.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/layers',
  responseContentType: 'application/json'
}

export function layersP () {}
layersP.api = {
  path: 'craigslist/{city}/{type}/FeatureServer/layers',
  method: 'POST',
  responseContentType: 'application/json'
}

