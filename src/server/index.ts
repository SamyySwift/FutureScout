import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import roadmapRouter from "./api/roadmap";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/roadmap", roadmapRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
