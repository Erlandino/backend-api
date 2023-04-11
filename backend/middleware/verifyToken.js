const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  let token = req.session.token; /* session token */

  // if no token is present (user not logged in)
  if (!token) {
    res.status(401).send({ message: "Failed! No token provided!", token: false });

    // if token is present
  }
  // checks if token present is valid
  else
    jwt.verify(token, process.env.jwtKey, (err, decoded) => {
      if (err) {
        // if its not valid

        return res.status(403).send({ message: "Unauthorized!", token: false });
      }
      req.userId = decoded.id;

      next();
    });
}
module.exports = verifyToken;
