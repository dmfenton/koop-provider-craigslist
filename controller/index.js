const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const TOKEN_ISSUER = process.env.TOKEN_ISSUER
const USERNAME = process.env.USERNAME || 'dummy'
const PASSWORD = process.env.PASSWORD || 'password'

module.exports = function (model) {
  this.model = model

  /**
   * create the authInfo object with Url specific to context of deployment
   * @param {*} req 
   */
  this.generateAuthInfo = function(req){
    return {
      metadata: {
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: `${req.protocol}://${req.headers.host}/craigslist/auth-server/generateToken`
        }
      }
    }
  }

  /**
   * Generate an access token if credentials pass authentication
   * @param {*} req 
   * @param {*} res 
   */
  this.generateToken = function (req, res) {
    // Temporary identity management
    if(req.query.username !== USERNAME || req.query.password !== PASSWORD) {
      res.status(200).json({
        'error' :{
          'code' : 400,
          'message' : 'Unable to generate token.',
          'details':['Invalid username or password.']
        }
      });
    }

    // Create access token
    let expires = Date.now() + (3 * 60 * 1000)
    let json = {
      token: jwt.sign({ exp: Math.floor(expires / 1000),iss: TOKEN_ISSUER, sub: req.query.username}, ACCESS_TOKEN_SECRET),
      expires
    }
    res.status(200).json(json)
  }
}
