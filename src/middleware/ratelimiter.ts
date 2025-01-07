import { Request, Response, NextFunction } from "express";

interface RequestQueue {
  clientIp: string;
  request: Request;
  response: Response;
  next: NextFunction;
}

interface RequestStore {
  [key: string]: number[];
}

const requestStore: RequestStore = {};
const requestQueue: RequestQueue[] = [];

export const rateLimiterWithQueue = (limit: number, timeWindow: number) => {
  setInterval(() => {
    if (requestQueue.length > 0) {
      const { clientIp, request, response, next } = requestQueue.shift()!;

      const currentTime = Date.now();

      requestStore[clientIp] = requestStore[clientIp].filter(
        (timestamp) => currentTime - timestamp <= timeWindow
      );

      if (requestStore[clientIp].length < limit) {
        requestStore[clientIp].push(currentTime);
        next();
      } else {
        requestQueue.push({ clientIp, request, response, next });
      }
    }
  }, 100);

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip as string;
    const currentTime = Date.now();

    if (!requestStore[clientIp!]) {
      requestStore[clientIp!] = [];
    }

    requestStore[clientIp!] = requestStore[clientIp!].filter(
      (timestamp) => currentTime - timestamp <= timeWindow
    );

    if (requestStore[clientIp!].length < limit) {
      requestStore[clientIp!].push(currentTime);
      next();
    } else {
      requestQueue.push({ clientIp, request: req, response: res, next });
    }
  };
};
