import CartProductModel from "../models/cartProduct.model.js";

import UserModel from "../models/user.model.js";

// Add Product To Cart
export async function addToCartItemController(req, res) {
  try {
    const userId = req.userId?.id;
    const { productId } = req.body;

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
        message: "Item already in the cart",
      });
    }

    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    const updateCartUser = await UserModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );

    return res.status(200).json({
      data: save,
      message: "Item add successfully",
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

    const cartItem = await CartProductModel.find({
      userId: userId,
    }).populate("productId");

    return res.status(402).json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update Quantity Cart Item
export async function updateCartItemQtyController(req, res) {
  try {
    const userId = req.userId?.id;

    const { _id, quantity } = req.body;

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
      }
    );

    return res.status(400).json({
      message: "Update cart successfully",
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
    const { _id, productId } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Please provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    if (!deleteCartItem) {
      return res.status(404).json({
        message: "The product in the cart is not found",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({
      _id: userId,
    });

    const cartItems = user?.shopping_cart;

    const updatedUserCart = [
      ...cartItems.slice(0, cartItems.indexOf(productId)),
      ...cartItems.slice(cartItems.indexOf(productId) + 1),
    ];

    user.shopping_cart = updatedUserCart;

    await user.save();

    return res.status(404).json({
      message: "Item removed",
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
