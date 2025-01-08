import { AuthenticatedRequest } from "../middleware/auth";
import { RegisteredAppModel } from "../models/RegisteredApp";
import { Response } from "express";

export async function editApp (req: AuthenticatedRequest, res : Response) {
    try {
      const { appId } = req.params;
      const userId = req.user?.id;
      const updates = req.body;
  
      const app = await RegisteredAppModel.findOne({ id: appId, userId });
  
      if (!app) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'App not found'
        });
      }
  
  
      const updatedApp = await RegisteredAppModel.updateOne({ id: appId, userId }, updates, { new: true });
  
      res.json({
        message: 'App updated successfully',
        app: updatedApp
      });
    } catch (error) {
      console.error('Update app error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while updating the app'
      });
    }
  }