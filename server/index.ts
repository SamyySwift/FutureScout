import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import roadmapRouter from "./api/roadmap";
import careersRouter from "./api/careers";
import learningPathRouter from "./api/learning-path";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/roadmap", roadmapRouter);
app.use("/api/careers", careersRouter);
app.use("/api/learning-path", learningPathRouter);

// Add other routes as needed

app.get("/", (req, res) => {
  res.send("Future Scout API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
});
