const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.json({ message: "authenticate Token tidak ditemukan" }).status(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    console.log("decoded user", decoded);
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
