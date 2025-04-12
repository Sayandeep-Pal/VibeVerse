const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: "100mb" })); // Increase limit for base64 data
app.use(express.urlencoded({ limit: "100mb", extended: true }));
require("dotenv").config();
mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const songSchema = new mongoose.Schema({
  title: String,
  singer: String,
  image: String, // Store base64 string
  songFile: String, // Store base64 string
});

const Song = mongoose.model("songs", songSchema);

app.get("/", (req, res) => {  
  res.send("Hello World!");
});

app.post("/api/songs", async (req, res) => {
  try {
    const { title, singer, image, songFile } = req.body;

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
