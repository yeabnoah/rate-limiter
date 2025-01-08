import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";
import { config } from "../config";

const redisClient = createClient({
  url: config.redis.url
});

interface RateLimitConfig {
  limit: number;
  timeWindow: number;
}

redisClient.connect().catch(console.error);

export const rateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientIp = req.ip as string;
      const key = `ratelimit:${clientIp}`;
      
      const requests = await redisClient.lRange(key, 0, -1);
      const currentTime = Date.now();
      
      
      const recentRequests = requests
        .map(Number)
        .filter(timestamp => currentTime - timestamp <= config.timeWindow);
      
      if (recentRequests.length >= config.limit) {
        const oldestRequest = Math.min(...recentRequests);
        const resetTime = oldestRequest + config.timeWindow;
        const timeToWait = resetTime - currentTime;
        
        res.set({
          'X-RateLimit-Limit': config.limit,
          'X-RateLimit-Remaining': 0,
          'X-RateLimit-Reset': Math.ceil(resetTime / 1000),
          'Retry-After': Math.ceil(timeToWait / 1000)
        });
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(timeToWait / 1000)} seconds`
        });
      }
      
      await redisClient.lPush(key, currentTime.toString());
      await redisClient.lTrim(key, 0, config.limit - 1);
      await redisClient.expire(key, Math.ceil(config.timeWindow / 1000));
      
      res.set({
        'X-RateLimit-Limit': config.limit,
        'X-RateLimit-Remaining': config.limit - recentRequests.length - 1,
        'X-RateLimit-Reset': Math.ceil((currentTime + config.timeWindow) / 1000)
      });
      
      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next(error);
    }
  };
};
