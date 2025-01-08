import { Router } from 'express';
import { authenticateApiKey, AuthenticatedRequest } from '../middleware/auth';
import { RegisteredAppModel } from '../models/RegisteredApp';
import { RateLimitConfig } from '../types';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateApiKey);

// Register a new app
router.post('/', async (req: AuthenticatedRequest, res) => {
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
});

// Get all apps for the authenticated user
router.get('/', async (req: AuthenticatedRequest, res) => {
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
});

// Update app configuration
router.put('/:appId', async (req: AuthenticatedRequest, res) => {
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

    Object.assign(app, updates);
    await app.save();

    res.json({
      message: 'App updated successfully',
      app
    });
  } catch (error) {
    console.error('Update app error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while updating the app'
    });
  }
});

// Delete an app
router.delete('/:appId', async (req: AuthenticatedRequest, res) => {
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
});

export default router; 