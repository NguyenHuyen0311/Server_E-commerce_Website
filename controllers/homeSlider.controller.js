import homeSliderModel from "../models/homeSlider.model.js";

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

// Create home slider
export async function createHomeSlider(req, res) {
  try {
    let slider = new homeSliderModel({
      images: imagesArr,
    });

    if (!slider) {
      res.status(500).json({
        message: "Slider not created",
        error: true,
        success: false,
      });
    }

    slider = await slider.save();

    imagesArr = [];

    return res.status(200).json({
      message: "Thêm ảnh quảng cáo thành công!",
      error: false,
      success: true,
      slider: slider,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get home slider
export async function getHomeSlides(req, res) {
  try {
    const slides = await homeSliderModel.find();

    if (!slides) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Slides not found",
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      data: slides,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get single home slider
export async function getHomeSlide(req, res) {
  try {
    const slide = await homeSliderModel.findById(req.params.id);

    if (!slide) {
      res.status(500).json({
        message: "The slide with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      slide: slide,
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
      return res.status(200).json({
        error: false,
        success: true,
        message: "Hình ảnh đã được xóa!",
      });
    }
  }
}

// Delete slide
export async function deleteHomeSlider(req, res) {
  try {
    const slide = await homeSliderModel.findById(req.params.id);
    const images = slide.images;

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

    const deleteSlide = await homeSliderModel.findByIdAndDelete(req.params.id);

    if (!deleteSlide) {
      res.status(404).json({
        message: "Slide not found!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Đã xóa ảnh quảng cáo!",
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update category
export async function updateHomeSlide(req, res) {
  try {
    const slide = await homeSliderModel.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesArr.length > 0 ? imagesArr[0] : req.body.images,
      },
      { new: true }
    );

    if (!slide) {
      return res.status(500).json({
        message: "Slide cannot be updated!",
        error: true,
        success: false,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      error: false,
      success: true,
      slide: slide,
      message: "Cập nhật ảnh quảng cáo thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete multiple home slide
export async function deleteMultipleHomeSlides(req, res) {
    const { ids } = req.body;
  
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
      await homeSliderModel.deleteMany({ _id: { $in: ids } });
  
      return res.status(200).json({
        message: "Xóa ảnh quảng cáo thành công!",
        error: false,
        success: true,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || error, error: true, success: false });
    }
  }