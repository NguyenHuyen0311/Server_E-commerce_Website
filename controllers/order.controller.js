import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

// Create order
export async function createOrderController(req, res) {
  try {
    let order = new OrderModel({
      userId: req.body.userId,
      products: req.body.products,
      order_status: req.body.order_status,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmount: req.body.totalAmount,
      date: req.body.date,
    });

    if (!order) {
      res.status(500).json({
        message: "Đặt hàng thất bại!",
        error: true,
        success: false,
      });
    }

    for (let i = 0; i < req.body.products.length; i++) {
      await ProductModel.findByIdAndUpdate(
        req.body.products[i].productId,
        {
          countInStock: parseInt(
            req.body.products[i].countInStock - req.body.products[i].quantity
          ),
        },
        { new: true }
      );
    }

    order = await order.save();

    return res.status(200).json({
      message: "Đặt hàng thành công!",
      error: false,
      success: true,
      order: order,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Get order details
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId?.id;

    const orderList = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId");

    return res.status(200).json({
      message: "Danh sách đơn hàng!",
      error: false,
      success: true,
      data: orderList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Create order paypal
export async function updateOrderStatusController(req, res) {
  try {
    const { id, order_status } = req.body;

    const updateOrderStatus = await OrderModel.updateOne(
      {
        _id: id,
      },
      {
        order_status: order_status,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Đã cập nhật lại trạng thái đơn hàng!",
      error: false,
      success: true,
      data: updateOrderStatus,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Create order paypal
export async function createOrderPaypalController(req, res) {
  try {
    const userId = req.userId?.id;

    const orderList = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address, User");

    return res.status(200).json({
      message: "Danh sách đơn hàng!",
      error: false,
      success: true,
      data: orderList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Capture order paypal
export async function captureOrderPaypalController(req, res) {
  try {
    const userId = req.userId?.id;

    const orderList = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address, User");

    return res.status(200).json({
      message: "Danh sách đơn hàng!",
      error: false,
      success: true,
      data: orderList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
