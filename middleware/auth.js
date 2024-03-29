// Code Inspiration - https://www.section.io/engineering-education/how-to-build-authentication-api-with-jwt-token-in-nodejs/


import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send(" A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};

export default verifyToken;
