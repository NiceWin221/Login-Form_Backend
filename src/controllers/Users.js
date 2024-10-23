const User = require("../model/Users");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
const Joi = require("joi");

const register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, username harus berupa string",
      "any.required": "Gagal membuat akun baru, username diperlukan",
    }),
    password: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, password harus berupa string",
      "any.required": "Gagal membuat akun baru, password diperlukan",
    }),
    email: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, email harus berupa string",
      "any.required": "Gagal membuat akun baru, email diperlukan",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  try {
    const { username, password, email } = req.body;
    const duplicate = await User.findOne({
      where: {
        username,
      },
    });

    if (duplicate) {
      return res.status(400).json({
        status: "fail",
        message: "Username telah digunakan",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const result = await User.create({
      id: `user-${nanoid(10)}`,
      username,
      password: hashedPwd,
      email,
    });

    return res.status(201).json({
      status: "success",
      message: "User has been created",
      userId: result.id,
    });
  } catch (error) {
    console.error("Error adding new user", error);
    return res.status(500).json({
      status: "Error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const login = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, username harus berupa string",
      "any.required": "Gagal membuat akun baru, username diperlukan",
    }),
    password: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, password harus berupa string",
      "any.required": "Gagal membuat akun baru, password diperlukan",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
    });
  }

  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({
      where: {
        username,
      },
    });

    if (!foundUser) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan",
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password",
      });
    }

    const accessToken = Jwt.sign({ id: foundUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    const refreshToken = Jwt.sign({ id: foundUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: false, maxAge: 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error authenticate user", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({
    where: {
      refreshToken,
    },
  });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  await foundUser.save();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
};

const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ where: { id: userId } });
    if (!user)
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });

    return res.status(200).json({
      username: user.username,
      profilePicture: user.profilePicture,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const updateUser = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, username harus berupa string",
      "any.required": "Gagal membuat akun baru, username diperlukan",
    }),
    email: Joi.string().required().messages({
      "string.base": "Gagal membuat akun baru, email harus berupa string",
      "any.required": "Gagal membuat akun baru, email diperlukan",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "fail",
      message: error.details[0].messages,
    });
  }

  try {
    const { username, email, phoneNumber } = req.body;
    const foundUser = await User.findOne({ where: { username } });
    if (!foundUser) {
      return res.status(404).json({
        status: "fail",
        message: "User tidak ditemukan",
      });
    }

    const result = await foundUser.update({
      email,
      phoneNumber,
    });

    return res.status(201).json({
      status: "success",
      email: result.email,
      phoneNumber: result.phoneNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = { register, login, logout, getUser, updateUser };
