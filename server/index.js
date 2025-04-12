const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path"); // Import the path module
require("dotenv").config(); // Load environment variables from .env file
const app = express();
const port = 5000; // Or any port you prefer

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Handle large base64 payloads
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))

app.use(express.static("public")); // Serve static files (images) from the 'public' directory

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Song Schema
const songSchema = new mongoose.Schema({
  title: String,
  singer: String,
  image: String, // Store the image filename
  songFile: String, // Store the song filename
});

const Song = mongoose.model("VibeVerse-songs", songSchema);

// Multer configuration for image upload
const imageStorage = multer.diskStorage({
  destination: "./public/images", // Store images in the 'public/images' directory
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Unique filename
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

// Multer configuration for song upload
const songStorage = multer.diskStorage({
  destination: "./public/songs", // Store songs in the 'public/songs' directory
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Unique filename
  },
});

const songUpload = multer({
  storage: songStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});

app.get("/", (req, res) => {
  res.send("Welcome to the Music API!");
});

// API endpoint to add a song
app.post(
  "/api/songs",
  imageUpload.single("image"),
  songUpload.single("songFile"),
  async (req, res) => {
    try {
      const { title, singer } = req.body;
      const image = req.file ? `/images/${req.file.filename}` : ""; // Save image path
      const songFile = req.files ? `/songs/${req.files.songFile.filename}` : ""; // Check

      const newSong = new Song({
        title,
        singer,
        image,
        songFile,
      });

      await newSong.save();
      res.status(201).json({ message: "Song added successfully!" });
    } catch (error) {
      console.error("Error adding song:", error);
      res.status(500).json({ message: "Error adding song" });
    }
  }
);

// API endpoint to get all songs
app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error("Error getting songs:", error);
    res.status(500).json({ message: "Error getting songs" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
