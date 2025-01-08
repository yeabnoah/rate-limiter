import mongoose from "mongoose";
import { RegisteredApp, RateLimitConfig } from "../types";
import { v4 as uuidv4 } from "uuid";

const rateLimitConfigSchema = new mongoose.Schema<RateLimitConfig>(
  {
    strategy: {
      type: String,
      enum: ["fixed-window", "sliding-window", "token-bucket"],
      required: true,
    },
    requestCount: { type: Number, required: true },
    timeWindow: { type: Number, required: true },
    maxQueueSize: { type: Number, required: false },
  },
  { _id: false }
);

const registeredAppSchema = new mongoose.Schema<RegisteredApp>({
  id: { type: String, default: () => uuidv4(), unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  baseUrl: { type: String, required: true },
  rateLimitConfig: { type: rateLimitConfigSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

registeredAppSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export const RegisteredAppModel = mongoose.model<RegisteredApp>(
  "RegisteredApp",
  registeredAppSchema
);
