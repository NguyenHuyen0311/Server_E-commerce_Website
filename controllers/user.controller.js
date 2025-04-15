import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

// User registration controller
export async function registerUserController(req, res) {
  try {
    let user;

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng cung cấp họ và tên, email và mật khẩu!",
        error: true,
        success: false,
      });
    }

    user = await UserModel.findOne({ email: email });
    if (user) {
      return res.json({
        message: "Bạn đã đăng ký tài khoản với địa chỉ email này!",
        error: true,
        success: false,
      });
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    user = new UserModel({
      email: email,
      password: hashPassword,
      name: name,
      otp: verifyCode,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minute expiry time
    });

    await user.save();

    // Send verification email
    await sendEmailFun(
      email,
      "Verify email from E-commerce",
      "",
      verificationEmail(name, verifyCode)
    );

    // Create a JWT token for verification purpose
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_WEB_TOKEN_SECRET_KEY,
      {
        expiresIn: "10m",
      }
    );

    return res.status(200).json({
      success: true,
      error: false,
      message: "Bạn đã đăng ký thành công! Vui lòng xác thực địa chỉ email!",
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Email verification controller
export async function verifyEmailController(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const isCodeValid = user.otp === otp;
    const isNotExpired = user.otpExpires > Date.now();

    if (isCodeValid && isNotExpired) {
      user.verify_email = true;
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return res.status(200).json({
        message: "Email verified successfully",
        error: false,
        success: true,
      });
    } else if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    } else {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// User auth with google controller
export async function authWithGoogle(req, res) {
  const { name, email, password, avatar, mobile, role } = req.body;

  try {
    const exitstingUser = await UserModel.findOne({ email: email });

    if (!exitstingUser) {
      const user = await UserModel.create({
        name: name,
        mobile: mobile,
        email: email,
        password: "null",
        avatar: avatar,
        role: role,
        verify_email: true,
        signUpWithGoogle: true,
      });

      await user.save();

      const accessToken = await generateAccessToken(user._id);
      const refreshToken = await generatedRefreshToken(user._id);

      await UserModel.findByIdAndUpdate(user._id, {
        last_login_date: new Date(),
      });

      const cookiesOption = {
        htttpOnly: true,
        secure: true,
        sameSite: "none",
      };
      res.cookie("access_token", accessToken, cookiesOption);
      res.cookie("refresh_token", refreshToken, cookiesOption);

      return res.json({
        message: "Đăng nhập thành công!",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    } else {
      const accessToken = await generateAccessToken(exitstingUser._id);
      const refreshToken = await generatedRefreshToken(exitstingUser._id);

      await UserModel.findByIdAndUpdate(exitstingUser._id, {
        last_login_date: new Date(),
      });

      const cookiesOption = {
        htttpOnly: true,
        secure: true,
        sameSite: "none",
      };
      res.cookie("access_token", accessToken, cookiesOption);
      res.cookie("refresh_token", refreshToken, cookiesOption);

      return res.json({
        message: "Đăng nhập thành công!",
        error: false,
        success: true,
        data: {
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// User login controller
export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Vui lòng liên hệ với admin!",
        error: true,
        success: false,
      });
    }

    if (user.verify_email !== true) {
      return res.status(400).json({
        message: "Địa chỉ email của bạn chưa được xác minh!",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Kiểm tra lại mật khẩu của bạn!",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      htttpOnly: true,
      secure: true,
      sameSite: "none",
    };
    res.cookie("access_token", accessToken, cookiesOption);
    res.cookie("refresh_token", refreshToken, cookiesOption);

    return res.json({
      message: "Đăng nhập thành công!",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// User logout controller
export async function logoutUserController(req, res) {
  try {
    const { id } = req.userId;
    console.log(id);
    if (!id) {
      return res.status(400).json({
        message: "Id của bạn không đúng",
        error: true,
        success: false,
      });
    }

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("access_token", cookiesOption);
    res.clearCookie("refresh_token", cookiesOption);

    await UserModel.findByIdAndUpdate(id, {
      refresh_token: "",
    });

    return res.json({
      message: "Đăng xuất thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// User avatar upload controller
var imagesArr = [];
export async function userAvatarController(req, res) {
  try {
    imagesArr = [];

    const { id } = req.userId;
    const image = req.files;

    const user = await UserModel.findById({ _id: id });

    // delete the old image from cloudinary
    const imgUrl = user.avatar;

    const urlArr = imgUrl.split("/");
    const url_image_avatar = urlArr[urlArr.length - 1];

    const imageName = url_image_avatar.split(".")[0];

    if (imageName) {
      const result = await cloudinary.uploader.destroy(
        imageName,
        (error, result) => {
          console.log("Image deleted:", result, error);
        }
      );
    }

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

    user.avatar = imagesArr[0];
    await user.save();

    return res.status(200).json({
      message: "Tải ảnh lên thành công!",
      _id: id,
      avatar: imagesArr[0],
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

// Update user details
export async function updateUserDetails(req, res) {
  try {
    const { id } = req.userId;
    const { name, email, mobile, password } = req.body;

    const userExist = await UserModel.findById(id);

    if (!userExist) {
      return res.status(400).send("Bạn không thể cập nhật!");
    }

    let verifyCode = "";

    if (email !== userExist.email) {
      verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    let hashPassword = "";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    } else {
      hashPassword = userExist.password;
    }

    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        name: name,
        mobile: mobile,
        email: email,
        verify_email: email !== userExist.email ? false : true,
        password: hashPassword,
        otp: verifyCode !== "" ? verifyCode : null,
        otpExpires:
          verifyCode !== "" ? new Date(Date.now() + 10 * 60 * 1000) : "",
        name: name,
      },
      { new: true }
    );

    if (email !== userExist.email) {
      await sendEmailFun(
        email,
        "Verify email from E-commerce",
        "",
        verificationEmail(name, verifyCode)
      );
    }

    return res.json({
      message: "Bạn đã cập nhật thông tin thành công!",
      error: false,
      success: true,
      user: {
        name: updateUser?.name,
        _id: updateUser?._id,
        mobile: updateUser?.mobile,
        avatar: updateUser?.avatar,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Forgot password
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại!",
        error: true,
        success: false,
      });
    } else {
      let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      let otpExpires = new Date(Date.now() + 10 * 60 * 1000);

      user.otp = verifyCode;
      user.otpExpires = otpExpires;

      await user.save();

      await sendEmailFun(
        email,
        "Verify OTP from E-commerce",
        "",
        verificationEmail(user.name, verifyCode)
      );

      return res.json({
        message: "Kiểm tra hộp thư email của bạn!",
        error: false,
        success: true,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Verify password OTP
export async function verifyForgotPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại!",
        error: true,
        success: false,
      });
    }

    if (!email || !otp) {
      return res.status(400).json({
        message: "Vui lòng cung cấp địa chỉ email và mã otp!",
        error: true,
        success: false,
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        message: "OTP không chính xác!",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.otpExpires < currentTime) {
      return res.status(400).json({
        message: "OTP đã quá hạn!",
        error: true,
        success: false,
      });
    }

    user.otp = "";
    user.otpExpires = "";

    await user.save();

    return res.status(200).json({
      message: "Xác minh OTP thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Reset password
export async function resetPassword(req, res) {
  try {
    const { email, newPassword, oldPassword, confirmPassword } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (user?.signUpWithGoogle === false) {
      if (!email || !newPassword || !confirmPassword || !oldPassword) {
        return res.status(400).json({
          message: "Vui lòng cung cấp đầy đủ thông tin!",
        });
      }
    } else {
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: "Vui lòng cung cấp đầy đủ thông tin!",
        });
      }
    }

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại!",
        error: true,
        success: false,
      });
    }

    if (user?.signUpWithGoogle === false) {
      const checkPassword = await bcryptjs.compare(oldPassword, user.password);
      if (!checkPassword) {
        return res.status(400).json({
          message: "Mật khẩu cũ sai!",
          error: true,
          success: false,
        });
      }
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới và xác nhận lại mật khẩu mới phải giống nhau!",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(confirmPassword, salt);

    user.password = hashPassword;
    user.signUpWithGoogle = false;
    await user.save();

    return res.json({
      message: "Cập nhật mật khẩu thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Refresh token
export async function refreshToken(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]; // [ Bearer token ]

    if (!refreshToken) {
      return res.status(401).json({
        message: "Token không chính xác!",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "Token đã quá hạn!",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?._id;
    const newAccessToken = await generateAccessToken(userId);

    const cookiesOption = {
      htttpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("access_token", newAccessToken, cookiesOption);

    return res.json({
      message: "New access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get user details
export async function userDetails(req, res) {
  try {
    const { id } = req.userId;

    const user = await UserModel.findById(id).select(
      "-password -refresh_token"
    );

    return res.status(200).json({
      message: "Chi tiết của người dùng",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
