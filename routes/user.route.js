import { Router } from 'express';
import { loginUserController, logoutUserController, registerUserController, removeImageFromCloudinary, userAvatarController, verifyEmailController } from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = Router();
userRouter.post('/register', registerUserController);
userRouter.post('/verify', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.get('/logout', auth, logoutUserController);
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/delete-image', auth, removeImageFromCloudinary);

export default userRouter;