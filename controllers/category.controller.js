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

// // Create category
// export async function createCategory(req, res) {
//     try {

//     } catch (error) {
//         return res
//           .status(500)
//           .json({ message: error.message || error, error: true, success: false });
//       }
// }

// // Create category
// export async function createCategory(req, res) {
//     try {

//     } catch (error) {
//         return res
//           .status(500)
//           .json({ message: error.message || error, error: true, success: false });
//       }
// }

// // Create category
// export async function createCategory(req, res) {
//     try {

//     } catch (error) {
//         return res
//           .status(500)
//           .json({ message: error.message || error, error: true, success: false });
//       }
// }

// // Create category
// export async function createCategory(req, res) {
//     try {

//     } catch (error) {
//         return res
//           .status(500)
//           .json({ message: error.message || error, error: true, success: false });
//       }
// }
