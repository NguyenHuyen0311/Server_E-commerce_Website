import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createCategory, deleteCategory, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount, removeImageFromCloudinary, updateCategory, uploadImages } from '../controllers/category.controller.js';

const categoryRouter = Router();
categoryRouter.post('/upload-images', auth, upload.array('images'), uploadImages);
categoryRouter.post('/create', auth, createCategory);
categoryRouter.get('/', getCategories);
categoryRouter.get('/get/count', getCategoriesCount);
categoryRouter.get('/get/count/sub-category', getSubCategoriesCount);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete('/delete-image', auth, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, deleteCategory);
categoryRouter.put('/:id', auth, updateCategory);

export default categoryRouter;