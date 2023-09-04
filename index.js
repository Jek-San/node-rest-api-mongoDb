const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const usersRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");
const postRoute = require('./routes/posts');

dotenv.config();
const corsOpt = {
  origin: ['http://localhost:3000', 'http://localhost:8800'],  // Replace with the allowed origin(s)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Set this to true if you want to allow credentials (cookies)
  optionsSuccessStatus: 204,
}
// Middleware
app.use(cors(corsOpt));
app.use(express.json()); // Parse JSON request bodies
app.use(helmet({
  crossOriginResourcePolicy: false,
})); // Add security headers
app.use(morgan("common")); // Log HTTP requests


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(8800, () => {
      console.log("Backend server is running!!!!");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const generateName = (something) => {
  const dateNow = Date.now();
  const result = `post/${dateNow.toString()}${something} `//
  return result;
}
// Serve static images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/post");
  },
  filename: (req, file, cb) => {

    cb(null, generateName(file.originalname));
  },
});
const upload = multer({ storage });

app.use("/images", express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  console.log(req.body.name)
  console.log(req.file)
  console.log(req.body)
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File uploaded successfully");
    return res.status(200).json({
      message: "File uploaded successfully",
      data: req.file.filename, // Return the filename as "data" in the response

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "File upload failed" });
  }
});
