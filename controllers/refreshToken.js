const jwt = require("jsonwebtoken");
const User = require("../model/Users");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["jwt"];
    if (!refreshToken) return res.json({ message: "refreshToken tidak ditemukan" }).status(401);

    const findUser = await User.findOne({ refreshToken: refreshToken });
    if (!findUser) return res.json({ message: "User tidak ditemukan" }).status(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden if token verification fails
      const username = decoded.username;
      const id = decoded.id;
      const accessToken = jwt.sign({ username, id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Internal error
  }
};

module.exports = refreshToken;
