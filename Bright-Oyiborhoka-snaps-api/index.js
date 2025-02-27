import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import fs from "fs";

/* const route = express.Router(); */
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
  console.log("/photos");
  fs.readFile("./Data/photos.json", "utf-8", (err, Data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }

    const jsonData = JSON.parse(Data);
    res.json(jsonData);
    console.log(jsonData);
  });
});

app.get("/photos/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  console.log(id);
  res.send("Get single photo");
});
