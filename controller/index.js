const jwt = require('jsonwebtoken');
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const TOKEN_ISSUER = process.env.TOKEN_ISSUER

module.exports = function (model) {
  this.model = model

  this.generateToken = function (req, res) {

    if (req.query.hasOwnProperty('token')) return accessToken(req, res)

    return authorizationGrant(req, res)
  }

  this.generateAuthInfo = function(req){
    return {
      metadata: {
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: `${req.protocol}://${req.headers.host}/auth-server/generateToken`
        }
      }
    }
  }
}

function authorizationGrant (req, res) {


    // req.query
    // {
    //   request: "getToken",
    //   username: "username",
    //   password: "password",
    //   expiration: 60
    //   referer: "www.arcgis.com"
    //   f: "json"
    // }

    // take username and password and authenticate

    let expires = Date.now() + (60 * 60 * 1000)
    // Generate token
    const token = jwt.sign({
      exp: Math.floor(expires / 1000),
      iss: TOKEN_ISSUER,
      sub: req.query.username
    }, AUTH_TOKEN_SECRET);

    // Generate Token Guts

    // generate authorization token
    // send back authorization payload
    let json = {
      token,
      expires
     }

    res.status(200).json(json)
}

function accessToken (req, res) {

  const tokenResponse = { 
    "error": {
      "code": 499,
      "message": "Token Required",
      "details": []
    }
  }
  if (req.query.token === undefined) return res.status(200).json(tokenResponse)

  jwt.verify(req.query.token, AUTH_TOKEN_SECRET, function(err, decoded) {
    if (err) return res.status(200).json(tokenResponse)

    let expires = Date.now() + (60 * 60 * 1000)

    const token = jwt.sign({
      exp: Math.floor(expires / 1000),
      iss: TOKEN_ISSUER,
      sub: req.query.username
    }, ACCESS_TOKEN_SECRET);
  
    let json = {
      token,
      expires
     }
  
    res.status(200).json(json)
  });


}
