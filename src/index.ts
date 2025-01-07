import express, { Request, Response } from "express";
import { rateLimiterWithQueue } from "./middleware/ratelimiter";

const app = express();

app.use(rateLimiterWithQueue(5, 60000));

app.get("/", (req: Request, res: Response) => {
  const ip = req.ip;
  res.status(200).json({
    message: "hello from api",
  });
});

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
