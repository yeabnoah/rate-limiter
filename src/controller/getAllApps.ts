import { AuthenticatedRequest } from "../middleware/auth";
import { RegisteredAppModel } from "../models/RegisteredApp";
import { Response } from "express";

export async function getAllApps (req: AuthenticatedRequest, res : Response) {
    try {
      const userId = req.user?.id;
      const apps = await RegisteredAppModel.find({ userId });
  
      res.json(apps);
    } catch (error) {
      console.error('Get apps error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching apps'
      });
    }
  }