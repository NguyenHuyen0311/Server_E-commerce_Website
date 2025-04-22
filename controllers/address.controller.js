import AddressModel from "../models/address.model.js";

import UserModel from "../models/user.model.js";

// Add Address
export async function addAddressController(req, res) {
  try {
    const userId = req.userId?.id;
    const { name, address_details, position, mobile, status } = req.body;

    if (!name || !address_details || !position || !mobile || !userId) {
      return res.status(402).json({
        message: "Vui lòng điền đầy đủ thông tin!",
        error: true,
        success: false,
      });
    }

    const address = new AddressModel({
      name,
      address_details,
      position,
      mobile,
      status,
      userId,
    });

    const save = await address.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          address_details: save?._id,
        },
      }
    );

    return res.status(200).json({
      data: save,
      message: "Thêm địa chỉ thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get Address
export async function getAddressController(req, res) {
  try {
    const userId = req.userId?.id;

    const address = await AddressModel.find({ userId });

    if (!address || address.length === 0) {
      return res.status(402).json({
        message: "Không tìm thấy địa chỉ!",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      address: address,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete Address
export async function deleteAddressController(req, res) {
  try {
    const userId = req.userId?.id;
    const _id = req.params.id;

    if (!_id) {
      return res.status(400).json({
        message: "Vui lòng cung cấp _id",
        error: true,
        success: false,
      });
    }

    const deleteAddressItem = await AddressModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (!deleteAddressItem) {
      return res.status(404).json({
        message: "Không tìm thấy địa chỉ!",
        error: true,
        success: false,
      });
    }

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { address_details: _id } }
    );

    return res.status(200).json({
      message: "Đã xóa địa chỉ!",
      error: false,
      success: true,
      data: deleteAddressItem,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update Address
export async function updateAddressController(req, res) {
  try {
    const userId = req.userId?.id;
    const addressId = req.params.id;

    if (!addressId) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ID địa chỉ!",
        error: true,
        success: false,
      });
    }

    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId, userId: userId },
      {
        name: req.body.name,
        mobile: req.body.mobile,
        address_details: req.body.address_details,
        position: req.body.position,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        message: "Không tìm thấy hoặc không thể cập nhật địa chỉ!",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cập nhật địa chỉ thành công!",
      error: false,
      success: true,
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Lỗi cập nhật địa chỉ:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get Single Address
export async function getSingleAddressController(req, res) {
  try {
    const id = req.params?.id;

    const address = await AddressModel.findOne({ _id: id });

    if (!address || address.length === 0) {
      return res.status(402).json({
        message: "Không tìm thấy địa chỉ!",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      address: address,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
