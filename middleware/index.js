const jwt = require('jsonwebtoken')
const unless = require('express-unless')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

const tokenValidator = function(req, res, next) {
  console.log('token-middleware')
  const tokenResponse = { 
    "error": {
      "code": 499,
      "message": "Token Required",
      "details": []
    }
  }
  if (req.query.token === undefined) return res.status(200).json(tokenResponse)

  jwt.verify(req.query.token, ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) next(err)
    next()
  });
}

tokenValidator.unless = unless;

module.exports = { tokenValidator }

