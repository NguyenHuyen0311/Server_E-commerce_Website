import CategoryModel from "../models/category.model.js";

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

// Create category
export async function createCategory(req, res) {
  try {
    let category = new CategoryModel({
      name: req.body.name,
      images: imagesArr,
      parentId: req.body.parentId,
      parentCatName: req.body.parentCatName,
    });

    if (!category) {
      res.status(500).json({
        message: "Category not created",
        error: true,
        success: false,
      });
    }

    category = await category.save();

    imagesArr = [];

    return res.status(500).json({
      message: "Category created",
      error: false,
      success: true,
      category: category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get categories
export async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};

    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat._doc, children: [] };
    });

    const rootCategories = [];

    categories.forEach((cat) => {
      if (cat.parentId) {
        categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    return res.status(200).json({
      error: false,
      success: true,
      data: rootCategories,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get category count
export async function getCategoriesCount(req, res) {
  try {
    const categoryCount = await CategoryModel.countDocuments({
      parentId: undefined,
    });

    if (!categoryCount) {
      res.status(500).json({ success: false });
    } else {
      res.send({
        categoryCount: categoryCount,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get sub category count
export async function getSubCategoriesCount(req, res) {
  try {
    const categories = await CategoryModel.find();

    if (!categories) {
      res.status(500).json({ success: false });
    } else {
      const subCatList = [];

      for (let cat of categories) {
        if (cat.parentId !== undefined) {
          subCatList.push(cat);
        }
      }

      res.send({
        subCategoryCount: subCatList.length,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get single category
export async function getCategory(req, res) {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      res.status(500).json({
        message: "The category with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      category: category,
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

// Delete category
export async function deleteCategory(req, res) {
  try {
    const category = await CategoryModel.findById(req.params.id);
    const images = category.images;
    // let img = "";

    for (const img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];

        const imageName = image.split(".")[0];

        if(imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {
                console.log(error, result);
            })
        }
    }

    const subCategory = await CategoryModel.find({
        parentId: req.params.id
    })

    for (let i = 0; i < subCategory.length; i++) {
        const thirdSubCategory = await CategoryModel.find({
            parentId: subCategory[i]._id 
        });

        for (let i = 0; i < thirdSubCategory.length; i++) {
            const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(thirdSubCategory[i]._id);
        }

        const deletedSubCat = await CategoryModel.findByIdAndDelete(subCategory[i]._id);
    }

    const deleteCat = await CategoryModel.findByIdAndDelete(req.params.id);

    if(!deleteCat) {
        res.status(404).json({
            message: "Category not found!",
            success: false,
            error: true
        });
    }

    return res.status(200).json({
        message: "Category deleted!",
        success: true,
        error: false
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update category
export async function updateCategory(req, res) {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            images: imagesArr.length > 0 ? imagesArr[0] : req.body.images,
            parentId: req.body.name,
            parentCatName: req.body.parentCatName,
        },
        { new: true }
    )

    if(!category) {
        return res.status(500).json({
            message: "Category cannot be updated!",
            error: true,
            success: false,
          });
    }

    imagesArr = [];

    return res.status(200).json({
        error: false,
        success: true,
        category: category,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}