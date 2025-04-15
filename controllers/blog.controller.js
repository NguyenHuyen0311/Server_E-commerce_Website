import BlogModel from "../models/blog.model.js";

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

// Create blog
export async function createBlog(req, res) {
  try {
    let blog = new BlogModel({
      title: req.body.title,
      images: imagesArr,
      description: req.body.description,
    });

    if (!blog) {
      res.status(500).json({
        message: "Blog not created",
        error: true,
        success: false,
      });
    }

    blog = await blog.save();

    imagesArr = [];

    return res.status(200).json({
      message: "Thêm bài viết thành công!",
      error: false,
      success: true,
      blog: blog,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get blogs
export async function getBlogs(req, res) {
  try {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await BlogModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const blogs = await BlogModel.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    if (!blogs) {
      res.status(500).json({
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      blogs: blogs,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get single blog
export async function getBlog(req, res) {
  try {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      res.status(500).json({
        message: "The blog with the given ID was not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      error: false,
      success: true,
      blog: blog,
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

// Delete Blog
export async function deleteBlog(req, res) {
  try {
    const blog = await BlogModel.findById(req.params.id);
    const images = blog.images;

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

    const deleteBlog = await BlogModel.findByIdAndDelete(req.params.id);

    if (!deleteBlog) {
      res.status(404).json({
        message: "Blog not found!",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Đã xóa bài viết!",
      success: true,
      error: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update Blog
export async function updateBlog(req, res) {
  try {
    const blog = await BlogModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        images: imagesArr.length > 0 ? imagesArr[0] : req.body.images,
        description: req.body.description,
      },
      { new: true }
    );

    if (!blog) {
      return res.status(500).json({
        message: "Blog cannot be updated!",
        error: true,
        success: false,
      });
    }

    imagesArr = [];

    return res.status(200).json({
      error: false,
      success: true,
      blog: blog,
      message: "Cập nhật bài viết thành công!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
