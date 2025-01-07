"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const rateLimiter = (limit, timeWindow) => {
    const requestStore = {};
    return (req, res, next) => {
        const clientIp = req.ip;
        const currentTime = Date.now();
        const windowStart = currentTime - timeWindow;
        if (!clientIp) {
            res.status(400).json({
                message: "couldn't find the ip",
            });
        }
        if (!requestStore[clientIp]) {
            requestStore[clientIp] = [];
        }
        requestStore[clientIp] = requestStore[clientIp].filter((timestamp) => timestamp > windowStart);
        if (requestStore[clientIp].length >= limit) {
            res.status(429).json({
                message: "Too many requests. Please try again later.",
            });
            return;
        }
        requestStore[clientIp].push(currentTime);
        next();
    };
};
exports.rateLimiter = rateLimiter;
