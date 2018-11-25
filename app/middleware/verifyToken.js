'use strict'

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        await jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
            if (err) {
                return res.json({
                    "error": true,
                    "status": 'Token expired/invalid token'
                });
            }
            req.decoded = decoded;
            next(); //no error, proceed to next
        });
    } else {
          // forbidden without token
          return res.status(403).send({
                "error": true,
                "status": 'No token provided'
          });
      }
  }