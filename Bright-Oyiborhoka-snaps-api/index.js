import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT || 5050;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`server running on ${PORT}.`);
});

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.get("/photos", (req, res) => {
  fs.readFile("./Data/photos.json", "utf-8", (err, Data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }

    const jsonData = JSON.parse(Data);
    res.json(jsonData);
  });
});

app.get("/tags", (req, res) => {
  fs.readFile("./Data/tags.json", "utf-8", (err, Tags) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }

    const jsonTags = JSON.parse(Tags);
    res.json(jsonTags);
  });
});

app.get("/photos/:id", (req, res) => {
  const { id } = req.params;

  // Reading the photos data from the JSON file to find the corresponding image
  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading photo data");
    }

    const photos = JSON.parse(data);
    const photo = photos.find((p) => p.id === id); // Assuming each photo has an "id" property
    res.json(photo);
  });
});

app.get("/photos/:id/comments", (req, res) => {
  const { id } = req.params;

  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading photo data");
    }

    const photos = JSON.parse(data);
    const photo = photos.find((p) => p.id === id);
    res.json(photo.comments);
  });
});


app.post("/photos/:id/comments", (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).send("Name and comment are required.");
  }

  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading photo data.");
    }

    let photos = JSON.parse(data);
    let photo = photos.find((p) => p.id === id);

    if (!photo) {
      return res.status(404).send("Photo not found.");
    }

    const newComment = {
      id: uuidv4(),
      name,
      comment,
      timestamp: Date.now(),
    };

    photo.comments.push(newComment);

    // Write the updated data back to the JSON file
    fs.writeFile("./Data/photos.json", JSON.stringify(photos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error saving comment.");
      }
      return res.status(200).json({ message: "Comment added successfully", newComment });
    });
  });
});