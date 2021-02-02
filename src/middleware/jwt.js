const jwt = require("jsonwebtoken");

const { badRequestError } = require("../../global_functions");

function VerifyUserJWT(req, res, next) {
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("empty token");
  jwt.verify(token, process.env.JWT_USER_SECRET, (error, users) => {
    if (error) {
      return badRequestError(res, "authorization token expired or wrong");
    }

    req.user=users;
//console.log("user details//"+users.accHash)
    

    next();
  });
};

module.exports = {VerifyUserJWT
                 }
