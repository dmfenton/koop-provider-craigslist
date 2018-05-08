const jwt = require('jsonwebtoken')
const unless = require('express-unless')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

/**
*
*/
function tokenValidator (providerName) {
  
  // Define validation function
  let validationFunc = function(req, res, next) {

    // Verify token
    jwt.verify(req.query.token, ACCESS_TOKEN_SECRET, function(err, decoded) {
      // Respond with success, but send 499 error object (AGOL spec)
      if (err) return res.status(200).json({ 
        "error": {
          "code": 499,
          "message": "Token Required",
          "details": []
        }
      }) 
      // Otherwise, move on to next middleware
      return next()
    });
  }

  // Add "unless" to validation function to exclude specific routes from getting this middleware
  validationFunc.unless = unless
  return validationFunc.unless({
    path: [
      {url: `/${providerName}/rest/info`, methods: ['GET', 'POST']},
      {url: `/${providerName}/generateToken`, methods: ['GET', 'POST']}
    ]
  });
}


module.exports = { tokenValidator }

