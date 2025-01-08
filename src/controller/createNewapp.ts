import { AuthenticatedRequest } from "../middleware/auth";
import { RegisteredAppModel } from "../models/RegisteredApp";
import { Request, Response } from "express";

export async function createNewApp (req: AuthenticatedRequest, res :Response) {
    try {
      const { name, baseUrl, rateLimitConfig } = req.body;
      const userId = req.user?.id;
  
      if (!name || !baseUrl || !rateLimitConfig) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Name, baseUrl, and rateLimitConfig are required'
        });
      }
  
      const app = new RegisteredAppModel({
        userId,
        name,
        baseUrl,
        rateLimitConfig
      });
  
      await app.save();
  
      res.status(201).json({
        message: 'App registered successfully',
        app: {
          id: app.id,
          name: app.name,
          baseUrl: app.baseUrl,
          rateLimitConfig: app.rateLimitConfig
        }
      });
    } catch (error) {
      console.error('App registration error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during app registration'
      });
    }
  }
