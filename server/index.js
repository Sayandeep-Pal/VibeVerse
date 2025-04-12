const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// MongoDB Connection
const MONGODB = process.env.MONGODB || "mongodb://localhost:27017/vibe-verse";
mongoose
  .connect(MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Song Schema
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  singer: { type: String, required: true },
  image: String, // Path to the image
  songFile: String, // Path to the song file
});

const Song = mongoose.model("VibeVerse-songs", songSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "public/uploads"; // Directory to save files
    fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "audio/mpeg",
    "audio/mp3",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and MP3 are allowed."),
      false
    ); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Error handling middleware for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File size too large. Max size is 10MB." });
    }
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    return res
      .status(500)
      .json({ message: `Unexpected error: ${err.message}` });
  }
  next(); // If no error, move to the next middleware
};

// API endpoint to add a song (FormData and file uploads)
app.post(
  "/api/songs",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "songFile", maxCount: 1 },
  ]),
  handleMulterError, // Use the error handling middleware
  async (req, res) => {
    try {
      const { title, singer } = req.body;

      // Check if required fields are present
      if (!title || !singer) {
        return res
          .status(400)
          .json({ message: "Title and singer are required." });
      }

      const imagePath = req.files["image"]
        ? `/uploads/${req.files["image"][0].filename}`
        : null;
      const songFilePath = req.files["songFile"]
        ? `/uploads/${req.files["songFile"][0].filename}`
        : null;

      const newSong = new Song({
        title,
        singer,
        image: imagePath,
        songFile: songFilePath,
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
app.get("/songs", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    console.error("Error getting songs:", error);
    res.status(500).json({ message: "Error getting songs" });
  }
});

// Basic route for the root
app.get("/", (req, res) => {
  res.send("VibeVerse API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
