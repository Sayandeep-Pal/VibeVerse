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
app.use(express.json({ limit: "100mb" })); // Handle large JSON payloads
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // Increase limit

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
  image: String, // Store base64 string
  songFile: String, // Store base64 string
});

const Song = mongoose.model("VibeVerse-songs", songSchema);

// API endpoint to add a song (Modified for base64 data)
app.post("/api/songs", async (req, res) => {
  try {
    const { title, singer, image, songFile } = req.body; // Extract base64 data

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
});

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
