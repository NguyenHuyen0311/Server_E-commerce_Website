import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createBlog, deleteBlog, getBlog, getBlogs, removeImageFromCloudinary, updateBlog, uploadImages } from '../controllers/blog.controller.js';

const blogRouter = Router();
blogRouter.post('/upload-images', auth, upload.array('images'), uploadImages);
blogRouter.post('/create', auth, createBlog);
blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlog);
blogRouter.delete('/delete-image', auth, removeImageFromCloudinary);
blogRouter.delete('/:id', auth, deleteBlog);
blogRouter.put('/:id', auth, updateBlog);

export default blogRouter;