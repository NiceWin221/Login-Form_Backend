const jwt = require("jsonwebtoken");
const User = require("../model/Users");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["jwt"];
    console.log("refreshtoken: ", refreshToken);
    if (!refreshToken) return res.status(404).json({ status: "fail", message: "refreshToken tidak ditemukan" });

    const findUser = await User.findOne({ where: { refreshToken } });
    if (!findUser) return res.status(404).json({ message: "User tidak ditemukan" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const id = decoded.id;
      const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
      return res.status(200).json({ status: "success", accessToken });
    });
  } catch (error) {
    console.error("Error getting new token", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

module.exports = refreshToken;
