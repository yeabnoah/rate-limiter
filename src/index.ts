import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { config } from "./config";
import authRoutes from "./routes/auth";
import appRoutes from "./routes/apps";
import { createAppProxy } from "./middleware/proxy";
import { authenticateApiKey } from "./middleware/auth";

const app = express();
const PORT = config?.server?.port || 3000;
const MONGO_URL = config?.mongodb?.url;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/health", (req: Request, res: Response) => {
  res.json({
    message: "server running",
  });
});

app.use("/auth", authRoutes);
app.use("/apps", appRoutes);
app.use("/apis/:appId/*", authenticateApiKey, createAppProxy);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
