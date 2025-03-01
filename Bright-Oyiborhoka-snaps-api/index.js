import express from "express";
import "dotenv/config";
import cors from "cors";
import photosRoutes from "./routes/photos.js";
import tagsRoutes from "./routes/tags.js";

const app = express();

const PORT = process.env.PORT || 5050;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));

// Use routes
app.use("/photos", photosRoutes);
app.use("/tags", tagsRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.listen(PORT, () => {
  alert(`Server running on ${PORT}.`);
});
