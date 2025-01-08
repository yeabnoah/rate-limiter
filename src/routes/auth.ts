import { Router } from 'express';
import { UserModel } from '../models/User';
import { registerUser } from '../controller/registerUser';

const router = Router();

router.post('/register', registerUser);

export default router; 