const namespace = require('../namespace')

module.exports = [
  {
    path: `/${namespace}/generateToken`,
    methods: ['get', 'post'],
    handler: 'generateToken'
  }
]