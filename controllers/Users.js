const User = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const duplicate = await User.findOne({
    where: {
      username: username,
    },
  });
  if (duplicate) return res.status(400).json({ message: "Username alredy exist!" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await User.create({
      username: username,
      password: hashedPwd,
      email: email,
    });
    console.log(result);
    res.status(201).json({ message: "User has been created!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required." });

  const foundUser = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!foundUser) return res.status(401).json({ message: "Invalid username or password" });

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({ message: "Invalid username or password" });

  // JWT
  const accessToken = jwt.sign({ username: foundUser.username, id: foundUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
  const refreshToken = jwt.sign({ username: foundUser.username, id: foundUser.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();
  console.log(result);
  res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });

  res.json({ accessToken });
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.sendStatus(500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: "username and email are required" });
    }

    const foundUser = await User.findOne({ where: { username: username } });
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await foundUser.update({
      email,
      phoneNumber,
    });

    console.log(result);

    res.json({ email: result.email, phoneNumber: result.phoneNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, getUser, updateUser };
