const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const usersRoute = require("./routes/users.js")

const authRoute = require("./routes/auth.js")

dotenv.config();

//Middleware
app.use(express.json());// Parse JSON requess bodies
app.use(helmet());// Add security headers
app.use(morgan("common")); // Log HTTP requests

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(8800, () => {
      console.log("Backend server is running!!!!");
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

//Routes

app.use("/api/users", usersRoute)
app.use("/api/auth", authRoute)