const express = require("express");
const { register, login, logout, getUser, updateUser } = require("../controllers/Users");
const { saveMovie, getSavedMovie, unsaveMovie, checkSavedMovie } = require("../controllers/Bookmark");
const { testingUser } = require("../controllers/testing");
const { uploadImage } = require("../controllers/uploadController");
const upload = require("../middlewares/multerConfig");
const authenticateToken = require("../middlewares/verifyJWT");
const refreshToken = require("../controllers/refreshToken");

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/token", refreshToken);

routes.get("/users", authenticateToken, getUser);
routes.put("/users", authenticateToken, updateUser);
routes.delete("/users", authenticateToken, logout);

routes.post("/movies", authenticateToken, saveMovie);
routes.get("/movies", authenticateToken, getSavedMovie);
routes.delete("/movies/:movieId", authenticateToken, unsaveMovie);
routes.get("/movies/:movieId", authenticateToken, checkSavedMovie);

routes.post("/uploads", authenticateToken, upload.single("image"), uploadImage);

routes.post("/testing/user", testingUser);

module.exports = routes;
