import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createHomeSlider, deleteHomeSlider, deleteMultipleHomeSlides, getHomeSlide, getHomeSlides, removeImageFromCloudinary, updateHomeSlide, uploadImages } from '../controllers/homeSlider.controller.js';

const homeSliderRouter = Router();
homeSliderRouter.post('/upload-images', auth, upload.array('images'), uploadImages);
homeSliderRouter.post('/create', auth, createHomeSlider);
homeSliderRouter.get('/', getHomeSlides);
homeSliderRouter.get('/:id', getHomeSlide);
homeSliderRouter.delete('/delete-image', auth, removeImageFromCloudinary);
homeSliderRouter.delete('/deleteMultipleHomeSlides', deleteMultipleHomeSlides);
homeSliderRouter.delete('/:id', auth, deleteHomeSlider);
homeSliderRouter.put('/:id', auth, updateHomeSlide);

export default homeSliderRouter;