const jwt = require('jsonwebtoken')
const namespace = require('../namespace')
const config = require('config');
const identityStore = require('../identity-store')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const TOKEN_ISSUER = process.env.TOKEN_ISSUER
const TOKEN_EXPIRATION_MINUTES = (config[namespace] && config[namespace].TOKEN_EXPIRATION_MINUTES) ? config[namespace].TOKEN_EXPIRATION_MINUTES : 60

module.exports = function (model) {
  this.model = model

  /**
   * create the authInfo object with Url specific to context of deployment
   * @param {string} rootUrl the request's protocol and host string, e.g http://example.com
   */
  this.authInfo = function(rootUrl){
    return {
      authInfo: {
        isTokenBasedSecurity: true,
        tokenServicesUrl: `${rootUrl}/${namespace}/generateToken`
      }
    }
  }

  /**
   * Generate an access token if credentials pass authentication
   * @param {*} req 
   * @param {*} res 
   */
  this.generateToken = function (req, res) {

    //Validate user's credentials
    identityStore
      .validateCredentials(req.query.username, req.query.password)
      .then(valid => { 
        // If credentials were not valid, send the error message (AGOL spec)
        if(!valid) {
          return res.status(200).json({
            'error' :{
              'code' : 400,
              'message' : 'Unable to generate token.',
              'details':['Invalid username or password.']
            }
          });
        }

        // Create access token
        let expires = Date.now() + (TOKEN_EXPIRATION_MINUTES * 60 * 1000)
        let json = {
          token: jwt.sign({ exp: Math.floor(expires / 1000),iss: TOKEN_ISSUER, sub: req.query.username}, ACCESS_TOKEN_SECRET),
          expires
        }
        res.status(200).json(json)
      })
      .catch(err=>{
        res.status(500).json(err)
      })
  }
}
