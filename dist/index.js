"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratelimiter_1 = require("./middleware/ratelimiter");
const app = (0, express_1.default)();
app.use((0, ratelimiter_1.rateLimiter)(5, 60000));
app.get("/", (req, res) => {
    const ip = req.ip;
    res.status(200).json({
        time: Date.now(),
        ipAddress: ip,
        message: "hello from api",
    });
});
app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
});
