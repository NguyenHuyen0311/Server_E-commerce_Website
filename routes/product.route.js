import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createProduct, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdCatId, getAllProductsByThirdCatName, uploadImages } from '../controllers/product.controller.js';

const productRouter = Router();
productRouter.post('/upload-images', auth, upload.array('images'), uploadImages);
productRouter.post('/create', auth, createProduct);
productRouter.get('/getAllProducts', getAllProducts);
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId);
productRouter.get('/getAllProductsByCatName', getAllProductsByCatName);
productRouter.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId);
productRouter.get('/getAllProductsBySubCatName', getAllProductsBySubCatName);
productRouter.get('/getAllProductsByThirdCatId/:id', getAllProductsByThirdCatId);
productRouter.get('/getAllProductsByThirdCatName', getAllProductsByThirdCatName);

export default productRouter;