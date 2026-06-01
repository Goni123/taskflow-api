import {Router} from 'express';
import * as projectsController from '../controllers/projectsController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, projectsController.getProjects);
router.post('/', authMiddleware, projectsController.createProject);
router.get('/:id', authMiddleware, projectsController.getProjectById);
router.put('/:id', authMiddleware, projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject);

export default router;