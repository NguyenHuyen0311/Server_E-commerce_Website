import MyWishlistModel from "../models/myWishlist.model.js";

// Add Product To My Wishlist
export async function addToMyWishlistController(req, res) {
  try {
    const userId = req.userId?.id;
    const {
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
    } = req.body;

    const item = await MyWishlistModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (item) {
      return res.status(400).json({
        message: "Item already in my wishlist",
      });
    }

    const myWishlist = new MyWishlistModel({
      productId,
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      brand,
      discount,
      userId,
    });

    const save = await myWishlist.save();

    return res.status(200).json({
      message: "Đã thêm sản phẩm vào danh sách yêu thích!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete Product From My Wishlist
export async function deleteFromMyWishlistController(req, res) {
  try {
    const myWishlistItem = await MyWishlistModel.findById(req.params.id);

    if (!myWishlistItem) {
      return res.status(404).json({
        message: "The item with this given id was not found",
        error: true,
        success: false,
      });
    }

    const deletedItem = await MyWishlistModel.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "The item is not deleted",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã xóa sản phẩm ra khỏi danh sách yêu thích!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get My Wishlist
export async function getMyWishlistController(req, res) {
  try {
    const userId = req.userId?.id;

    const myWishlistItems = await MyWishlistModel.find({
        userId: userId
    });

    return res.status(200).json({
      error: false,
      success: true,
      data: myWishlistItems
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
