const express = require("express");
const { register, login, logout, getUser, updateUser } = require("../controllers/Users");
const { saveMovie, getSavedMovie, unsaveMovie, checkSavedMovie } = require("../controllers/Bookmark");
const { uploadImage } = require("../controllers/uploadController");
const upload = require("../middlewares/multerConfig");
const authenticateToken = require("../middlewares/verifyJWT");
const refreshToken = require("../controllers/refreshToken");

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/token", refreshToken);
routes.get("/getUser", authenticateToken, getUser);
routes.post("/updateUser", updateUser);
routes.delete("/logout", logout);
routes.post("/saveMovie", authenticateToken, saveMovie);
routes.get("/getSavedMovie", authenticateToken, getSavedMovie);
routes.delete("/unsaveMovie", authenticateToken, unsaveMovie);
routes.post("/checkSavedMovie", authenticateToken, checkSavedMovie);
routes.post("/uploads", authenticateToken, upload.single("image"), uploadImage);

module.exports = routes;
