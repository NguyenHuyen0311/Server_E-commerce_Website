import { Router } from 'express';
import { authWithGoogle, forgotPasswordController, loginUserController, logoutUserController, refreshToken, registerUserController, removeImageFromCloudinary, resetPassword, updateUserDetails, userAvatarController, userDetails, verifyEmailController, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = Router();
userRouter.post('/register', registerUserController);
userRouter.post('/verify', verifyEmailController);
userRouter.post('/login', loginUserController);
userRouter.post('/authWithGoogle', authWithGoogle);
userRouter.get('/logout', auth, logoutUserController);
userRouter.post('/user-avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.delete('/delete-image', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails);
userRouter.post('/forgot-password', forgotPasswordController);
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/refresh-token', refreshToken);
userRouter.get('/user-details', auth, userDetails);

export default userRouter;