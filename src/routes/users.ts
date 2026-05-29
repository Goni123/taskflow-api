import {Router} from 'express';
import * as usersController from '../controllers/usersController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, usersController.getMe);

export default router;