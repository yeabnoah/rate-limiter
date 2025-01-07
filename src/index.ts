import express, {Request, Response, NextFunction} from "express";
import { rateLimiter } from "./middleware/ratelimiter";
import { proxyMiddleware } from "./middleware/proxy";
import { config } from "./config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/api", rateLimiter({
  limit: config.rateLimit.defaultLimit,
  timeWindow: config.rateLimit.defaultTimeWindow
}), proxyMiddleware);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message
  });
});

const port = config.port;
app.listen(port, () => {
  console.log(`Rate Limiting Proxy API is running on http://localhost:${port}`);
  console.log(`Forwarding requests to: ${config.targetApi.url}`);
});
