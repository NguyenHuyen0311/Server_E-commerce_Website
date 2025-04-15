import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createProduct,
  createProductFlavor,
  createProductWeight,
  deleteMultipleProducts,
  deleteProduct,
  deleteProductFlavor,
  deleteProductWeight,
  filters,
  getAllFeaturedProducts,
  getAllProducts,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsByThirdCatId,
  getAllProductsByThirdCatName,
  getAllProductsCount,
  getProduct,
  getProductFlavor,
  getProductFlavorById,
  getProductWeight,
  getProductWeightById,
  removeImageFromCloudinary,
  sortBy,
  updateProduct,
  updateProductFlavor,
  updateProductWeight,
  uploadImages,
} from "../controllers/product.controller.js";

const productRouter = Router();
productRouter.post(
  "/upload-images",
  auth,
  upload.array("images"),
  uploadImages
);
productRouter.post("/create", auth, createProduct);
productRouter.post("/productFlavor/create", auth, createProductFlavor);
productRouter.post("/productWeight/create", auth, createProductWeight);
productRouter.post("/filters", filters);
productRouter.post("/sortBy", sortBy);

productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getAllProductsByCatId/:id", getAllProductsByCatId);
productRouter.get("/getAllProductsByCatName", getAllProductsByCatName);
productRouter.get("/getAllProductsBySubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/getAllProductsBySubCatName", getAllProductsBySubCatName);
productRouter.get(
  "/getAllProductsByThirdCatId/:id",
  getAllProductsByThirdCatId
);
productRouter.get(
  "/getAllProductsByThirdCatName",
  getAllProductsByThirdCatName
);
productRouter.get("/getAllProductsByPrice", getAllProductsByPrice);
productRouter.get("/getAllProductsByRating", getAllProductsByRating);
productRouter.get("/getAllProductsCount", getAllProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllFeaturedProducts);

productRouter.delete("/delete-image", auth, removeImageFromCloudinary);
productRouter.delete("/deleteMultipleProducts", deleteMultipleProducts);

productRouter.get("/productFlavor/get", getProductFlavor);
productRouter.get("/productWeight/get", getProductWeight);
productRouter.get("/:id", getProduct);
productRouter.get("/productFlavor/:id", getProductFlavorById);
productRouter.get("/productWeight/:id", getProductWeightById);

productRouter.delete("/:id", deleteProduct);
productRouter.delete("/productFlavor/:id", deleteProductFlavor);
productRouter.delete("/productWeight/:id", deleteProductWeight);

productRouter.put("/updateProduct/:id", auth, updateProduct);
productRouter.put("/productFlavor/:id", auth, updateProductFlavor);
productRouter.put("/productWeight/:id", auth, updateProductWeight);

export default productRouter;
