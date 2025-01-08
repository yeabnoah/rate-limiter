import { Router } from 'express';
import { authenticateApiKey, AuthenticatedRequest } from '../middleware/auth';
import { RegisteredAppModel } from '../models/RegisteredApp';
import { RateLimitConfig } from '../types';
import { createNewApp } from '../controller/createNewapp';
import { getAllApps } from '../controller/getAllApps';
import { editApp } from '../controller/editApp';
import { deleteApp } from '../controller/deleteApp';

const router = Router();

router.use(authenticateApiKey);
router.post('/', createNewApp );
router.get('/', getAllApps );
router.put('/:appId',editApp );
router.delete('/:appId',deleteApp );

export default router; 