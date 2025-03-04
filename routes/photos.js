import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// GET all photos
router.get("/", (req, res) => {
  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    res.json(JSON.parse(data));
  });
});

// GET a single photo by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading photo data");
    }

    const photos = JSON.parse(data);
    const photo = photos.find((p) => p.id === id);

    if (!photo) {
      return res.status(404).send("Photo not found.");
    }

    res.json(photo);
  });
});

// GET comments for a photo
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  fs.readFile("./Data/photos.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading photo data");
    }

    const photos = JSON.parse(data);
    const photo = photos.find((p) => p.id === id);

    if (!photo) {
      return res.status(404).send("Photo not found.");
    }

    res.json(photo.comments);
  });
});

// POST a new comment to a photo
router.post("/:id/comments", (req, res) => {
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

export default router;
