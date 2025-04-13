import ProductModel from "../models/product.model.js";
import productFlavorModel from "../models/productFlavor.model.js";
import productWeightModel from "../models/productWeight.model.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

// Upload image
var imagesArr = [];
export async function uploadImages(req, res) {
  try {
    imagesArr = [];

    const image = req.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    };

    for (let i = 0; i < image?.length; i++) {
      const img = await cloudinary.uploader.upload(
        image[i].path,
        options,
        function (error, result) {
          if (error) {
            console.error("Upload Error:", error);
          } else {
            imagesArr.push(result.secure_url);
            fs.unlinkSync(`uploads/${req.files[i].filename}`);
          }
        }
      );
    }

    return res.status(200).json({
      images: imagesArr,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Create product
export async function createProduct(req, res) {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: imagesArr,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      catId: req.body.catId,
      subCatId: req.body.subCatId,
      subCatName: req.body.subCatName,
      thirdSubCatId: req.body.thirdSubCatId,
      thirdSubCatName: req.body.thirdSubCatName,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      discount: req.body.discount,
      productWeight: req.body.productWeight,
      productFlavor: req.body.productFlavor,
    });

    product = await product.save();

    if (!product) {
      res.status(500).json({
        error: true,
        success: false,
        message: "Product not created",
      });
    }

    imagesArr = [];

    res.status(200).json({
      message: "Thêm sản phẩm thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products
export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by category id
export async function getAllProductsByCatId(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      catId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by category name
export async function getAllProductsByCatName(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      catName: req.query.catName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by sub category id
export async function getAllProductsBySubCatId(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by sub category name
export async function getAllProductsBySubCatName(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCatName: req.query.subCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by third category id
export async function getAllProductsByThirdCatId(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdSubCatId: req.params.id,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by third category name
export async function getAllProductsByThirdCatName(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      thirdSubCatName: req.query.thirdSubCatName,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by price
export async function getAllProductsByPrice(req, res) {
  try {
    let productList = [];

    if (req.query.catId !== "" && req.query.catId !== undefined) {
      const productListArr = await ProductModel.find({
        catId: req.query.catId,
      }).populate("category");

      productList = productListArr;
    }

    if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
      const productListArr = await ProductModel.find({
        subCatId: req.query.subCatId,
      }).populate("category");

      productList = productListArr;
    }

    if (
      req.query.thirdSubCatId !== "" &&
      req.query.thirdSubCatId !== undefined
    ) {
      const productListArr = await ProductModel.find({
        thirdSubCatId: req.query.thirdSubCatId,
      }).populate("category");

      productList = productListArr;
    }

    const filteredProducts = productList.filter((product) => {
      if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
        return false;
      }
      if (req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)) {
        return false;
      }
      return true;
    });

    return res.status(200).json({
      error: false,
      success: true,
      products: filteredProducts,
      totalPages: 0,
      page: 0,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products by rating
export async function getAllProductsByRating(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    let products = [];

    if (req.query.catId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        catId: req.query.catId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.subCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        subCatId: req.query.subCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (req.query.thirdSubCatId !== undefined) {
      products = await ProductModel.find({
        rating: req.query.rating,
        thirdSubCatId: req.query.thirdSubCatId,
      })
        .populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();
    }

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all products count
export async function getAllProductsCount(req, res) {
  try {
    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      error: false,
      success: true,
      productsCount: productsCount,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get all features products
export async function getAllFeaturedProducts(req, res) {
  try {
    const products = await ProductModel.find({
      isFeatured: true,
    }).populate("category");

    if (!products) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      products: products,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete product
export async function deleteProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "category"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const images = product.images;

    for (const img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          console.log(error, result);
        });
      }
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({
        message: "Product not deleted",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã xóa sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete multiple products
export async function deleteMultipleProducts(req, res) {
  const { ids } = req.body;

  // console.log(ids);

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({
      message: "Invalid input",
      error: true,
      success: false,
    });
  }

  for (let i = 0; i < ids?.length; i++) {
    const product = await ProductModel.findById(ids[i]);

    const images = product.images;
    let img = "";

    for (img of images) {
      const imgUrl = img;
      const urlArr = imgUrl.split("/");
      const image = urlArr[urlArr.length - 1];

      const imageName = image.split(".")[0];

      if (imageName) {
        cloudinary.uploader.destroy(imageName, (error, result) => {
          console.log(error, result);
        });
      }
    }
  }

  try {
    await ProductModel.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      message: "Xóa sản phẩm thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get single product
export async function getProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id).populate(
      "category"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      product: product,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Remove image from Cloudinary
export async function removeImageFromCloudinary(req, res) {
  const imgUrl = req.query.img;

  const urlArr = imgUrl.split("/");
  const image = urlArr[urlArr.length - 1];

  const imageName = image.split(".")[0];

  if (imageName) {
    const result = await cloudinary.uploader.destroy(
      imageName,
      (error, result) => {
        console.log("Image deleted:", result, error);
      }
    );

    if (result) {
      res.status(200).send(result);
    }
  }
}

// Update product
export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        catId: req.body.catId,
        subCatId: req.body.subCatId,
        subCatName: req.body.subCatName,
        thirdSubCatId: req.body.thirdSubCatId,
        thirdSubCatName: req.body.thirdSubCatName,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        discount: req.body.discount,
        productWeight: req.body.productWeight,
        productFlavor: req.body.productFlavor,
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product cannot be updated!",
        error: true,
        success: false,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      message: "Đã cập nhật sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get product flavor
export async function getProductFlavor(req, res) {
  try {
    const productFlavor = await productFlavorModel.find();

    if (!productFlavor) {
      return res.status(400).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      data: productFlavor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get product flavor by id
export async function getProductFlavorById(req, res) {
  try {
    const productFlavor = await productFlavorModel.findById(req.params.id);

    if (!productFlavor) {
      return res.status(400).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      data: productFlavor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Create product flavor
export async function createProductFlavor(req, res) {
  try {
    let productFlavors = new productFlavorModel({
      name: req.body.name,
    });

    productFlavors = await productFlavors.save();

    if (!productFlavors) {
      res.status(500).json({
        error: true,
        success: false,
        message: "Product Flavor not created",
      });
    }

    res.status(200).json({
      message: "Thêm hương vị sản phẩm thành công!",
      error: false,
      success: true,
      productFlavor: productFlavors,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete product flavor
export async function deleteProductFlavor(req, res) {
  try {
    const productFlavor = await productFlavorModel.findById(req.params.id);

    if (!productFlavor) {
      return res.status(404).json({
        message: "Item not found",
        error: true,
        success: false,
      });
    }

    const deleteProductFlavor = await productFlavorModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteProductFlavor) {
      return res.status(404).json({
        message: "Product Flavor not deleted",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã xóa hương vị sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update product flavor
export async function updateProductFlavor(req, res) {
  try {
    const productFlavor = await productFlavorModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    if (!productFlavor) {
      return res.status(404).json({
        message: "Product flavor cannot be updated!",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã cập nhật hương vị sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get product Weight
export async function getProductWeight(req, res) {
  try {
    const productWeight = await productWeightModel.find();

    if (!productWeight) {
      return res.status(400).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      data: productWeight,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get product Weight by id
export async function getProductWeightById(req, res) {
  try {
    const productWeight = await productWeightModel.findById(req.params.id);

    if (!productWeight) {
      return res.status(400).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      data: productWeight,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Create product Weight
export async function createProductWeight(req, res) {
  try {
    let productWeights = new productWeightModel({
      name: req.body.name,
    });

    productWeights = await productWeights.save();

    if (!productWeights) {
      res.status(500).json({
        error: true,
        success: false,
        message: "Product Weight not created",
      });
    }

    res.status(200).json({
      message: "Thêm hương vị sản phẩm thành công!",
      error: false,
      success: true,
      productWeight: productWeights,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete product Weight
export async function deleteProductWeight(req, res) {
  try {
    const productWeight = await productWeightModel.findById(req.params.id);

    if (!productWeight) {
      return res.status(404).json({
        message: "Item not found",
        error: true,
        success: false,
      });
    }

    const deleteProductWeight = await productWeightModel.findByIdAndDelete(
      req.params.id
    );

    if (!deleteProductWeight) {
      return res.status(404).json({
        message: "Product Weight not deleted",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã xóa hương vị sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update product Weight
export async function updateProductWeight(req, res) {
  try {
    const productWeight = await productWeightModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      {
        new: true,
      }
    );

    if (!productWeight) {
      return res.status(404).json({
        message: "Product Weight cannot be updated!",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã cập nhật hương vị sản phẩm!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
