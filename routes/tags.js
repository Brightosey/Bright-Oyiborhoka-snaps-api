import express from "express";
import fs from "fs";

const router = express.Router();

// GET all tags
router.get("/", (req, res) => {
  fs.readFile("./Data/tags.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    res.json(JSON.parse(data));
  });
});

export default router;
