import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { createProduct, deleteProduct, getAllFeaturedProducts, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsCount, getProduct, removeImageFromCloudinary, updateProduct, uploadImages } from '../controllers/product.controller.js';

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
productRouter.get('/getAllProductsByPrice', getAllProductsByPrice);
productRouter.get('/getAllProductsByRating', getAllProductsByRating);
productRouter.get('/getAllProductsCount', getAllProductsCount);
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/:id', getProduct);
productRouter.delete('/delete-image', auth, removeImageFromCloudinary);
productRouter.put('/updateProduct/:id', auth, updateProduct);

export default productRouter;