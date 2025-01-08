import { AuthenticatedRequest } from "../middleware/auth";
import { RegisteredAppModel } from "../models/RegisteredApp";
import { Response } from "express";

export async function deleteApp (req: AuthenticatedRequest, res : Response) {
    try {
      const { appId } = req.params;
      const userId = req.user?.id;
  
      const result = await RegisteredAppModel.deleteOne({ id: appId, userId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'App not found'
        });
      }
  
      res.json({
        message: 'App deleted successfully'
      });
    } catch (error) {
      console.error('Delete app error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while deleting the app'
      });
    }
  }