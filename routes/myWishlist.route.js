import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { addToMyWishlistController, deleteFromMyWishlistController, getMyWishlistController } from '../controllers/myWishlist.controller.js';

const myWishlistRouter = Router();
myWishlistRouter.post('/add', auth, addToMyWishlistController);
myWishlistRouter.delete('/:id', auth, deleteFromMyWishlistController);
myWishlistRouter.get('/', auth, getMyWishlistController);

export default myWishlistRouter;