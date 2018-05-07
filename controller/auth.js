const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

module.exports = { tokenValidator }

function tokenValidator(req, res, next) {
  const tokenResponse = { 
    "error": {
      "code": 499,
      "message": "Token Required",
      "details": []
    }
  }
  if (req.query.token === undefined) return res.status(200).json(tokenResponse)

  jwt.verify(req.query.token, ACCESS_TOKEN_SECRET, function(err, decoded) {
    if (err) return res.status(200).json(tokenResponse)
    next()
  });

  next()
}