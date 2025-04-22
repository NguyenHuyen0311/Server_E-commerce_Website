import CartProductModel from "../models/cartProduct.model.js";

// Add Product To Cart
export async function addToCartItemController(req, res) {
  try {
    const userId = req.userId?.id;
    const {
      productTitle,
      image,
      rating,
      price,
      oldPrice,
      discount,
      flavor,
      weight,
      quantity,
      subTotal,
      productId,
      countInStock,
      brand
    } = req.body;

    if (!productId) {
      return res.status(402).json({
        message: "Provide productId",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkItemCart) {
      return res.status(400).json({
        message: "Sản phẩm đã có trong giỏ hàng!",
      });
    }

    const cartItem = new CartProductModel({
      productTitle: productTitle,
      image: image,
      rating: rating,
      price: price,
      oldPrice: oldPrice,
      discount: discount,
      quantity: quantity,
      flavor: flavor,
      weight: weight,
      subTotal: subTotal,
      productId: productId,
      countInStock: countInStock,
      userId: userId,
      brand: brand
    });

    const save = await cartItem.save();

    return res.status(200).json({
      data: save,
      message: "Thêm sản phẩm vào giỏ thành công!",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get Product From Cart
export async function getCartItemController(req, res) {
  try {
    const userId = req.userId?.id;

    const cartItems = await CartProductModel.find({
      userId: userId,
    });

    return res.status(200).json({
      data: cartItems,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update Cart Item
export async function updateCartItemController(req, res) {
  try {
    const userId = req.userId?.id;

    const { _id, quantity, subTotal, flavor, weight } = req.body;

    if (!_id || !quantity) {
      return res.status(400).json({
        message: "Please provide _id, quantity",
      });
    }

    const updateCartItem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: quantity,
        subTotal: subTotal,
        flavor: flavor !== undefined ? flavor : '',
        weight: weight !== undefined ? weight : ''
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Đã cập nhật lại sản phẩm!",
      success: true,
      error: false,
      data: updateCartItem,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Delete Quantity Cart Item
export async function deleteCartItemQtyController(req, res) {
  try {
    const userId = req.userId?.id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Please provide id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: id,
      userId: userId,
    });

    if (!deleteCartItem) {
      return res.status(404).json({
        message: "The product in the cart is not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Đã xóa sản phẩm khỏi giỏ hàng!",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Empty Cart 
export async function emptyCartController(req, res) {
  try {
    const userId = req.params.id;
    
    await CartProductModel.deleteMany({ userId: userId })

    return res.status(200).json({
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}