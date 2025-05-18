import { Router } from 'express';
import { loginAdminController, registerAdminController } from '../controllers/user.controller.js';

const adminRouter = Router();
adminRouter.post('/register', registerAdminController);
adminRouter.post('/login', loginAdminController);

export default adminRouter;