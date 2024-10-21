require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes/index");
const db = require("./config/db");
const PORT = process.env.PORT || 3000;
const path = require("path");

// Connecting to Database
const testDatabaseConnection = async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDatabaseConnection();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/getImage", express.static(path.join(__dirname, "public/uploads")));
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
