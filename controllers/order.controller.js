import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

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
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({
        message: "Page not found",
        error: true,
        success: false,
      });
    }

    const orderList = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate("userId")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    return res.status(200).json({
      message: "Danh sách đơn hàng!",
      error: false,
      success: true,
      data: orderList,
      totalPages: totalPages,
      page: page,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Update order status
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

// Total Sales
export async function totalSalesController(req, res) {
  try {
    const currentYear = new Date().getFullYear();

    const orderList = await OrderModel.find();

    let totalSales = 0;
    let monthlySales = [
      {
        name: "Tháng 1",
        TotalSales: 0,
      },
      {
        name: "Tháng 2",
        TotalSales: 0,
      },
      {
        name: "Tháng 3",
        TotalSales: 0,
      },
      {
        name: "Tháng 4",
        TotalSales: 0,
      },
      {
        name: "Tháng 5",
        TotalSales: 0,
      },
      {
        name: "Tháng 6",
        TotalSales: 0,
      },
      {
        name: "Tháng 7",
        TotalSales: 0,
      },
      {
        name: "Tháng 8",
        TotalSales: 0,
      },
      {
        name: "Tháng 9",
        TotalSales: 0,
      },
      {
        name: "Tháng 10",
        TotalSales: 0,
      },
      {
        name: "Tháng 11",
        TotalSales: 0,
      },
      {
        name: "Tháng 12",
        TotalSales: 0,
      },
    ];

    for (let i = 0; i < orderList.length; i++) {
      totalSales = totalSales + parseInt(orderList[i].totalAmount);
      const str = JSON.stringify(orderList[i]?.createdAt);
      const year = str.substr(1, 4);
      const monthStr = str.substr(6, 8);
      const month = parseInt(monthStr.substr(0, 2));

      if (currentYear == year) {
        if (month === 1) {
          monthlySales[0] = {
            name: "Tháng 1",
            TotalSales: (monthlySales[0].TotalSales =
              parseInt(monthlySales[0].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 2) {
          monthlySales[1] = {
            name: "Tháng 2",
            TotalSales: (monthlySales[1].TotalSales =
              parseInt(monthlySales[1].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 3) {
          monthlySales[2] = {
            name: "Tháng 3",
            TotalSales: (monthlySales[2].TotalSales =
              parseInt(monthlySales[2].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 4) {
          monthlySales[3] = {
            name: "Tháng 4",
            TotalSales: (monthlySales[3].TotalSales =
              parseInt(monthlySales[3].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 5) {
          monthlySales[4] = {
            name: "Tháng 5",
            TotalSales: (monthlySales[4].TotalSales =
              parseInt(monthlySales[4].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 6) {
          monthlySales[5] = {
            name: "Tháng 6",
            TotalSales: (monthlySales[5].TotalSales =
              parseInt(monthlySales[5].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 7) {
          monthlySales[6] = {
            name: "Tháng 7",
            TotalSales: (monthlySales[6].TotalSales =
              parseInt(monthlySales[6].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 8) {
          monthlySales[7] = {
            name: "Tháng 8",
            TotalSales: (monthlySales[7].TotalSales =
              parseInt(monthlySales[7].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 9) {
          monthlySales[8] = {
            name: "Tháng 9",
            TotalSales: (monthlySales[8].TotalSales =
              parseInt(monthlySales[8].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 10) {
          monthlySales[9] = {
            name: "Tháng 10",
            TotalSales: (monthlySales[9].TotalSales =
              parseInt(monthlySales[9].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 11) {
          monthlySales[10] = {
            name: "Tháng 11",
            TotalSales: (monthlySales[10].TotalSales =
              parseInt(monthlySales[10].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
        if (month === 12) {
          monthlySales[11] = {
            name: "Tháng 12",
            TotalSales: (monthlySales[11].TotalSales =
              parseInt(monthlySales[11].TotalSales) +
              parseInt(orderList[i].totalAmount)),
          };
        }
      }
    }

    return res.status(200).json({
      error: false,
      success: true,
      totalSales: totalSales,
      monthlySales: monthlySales,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

// Total Users
export async function totalUsersController(req, res) {
  try {
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    let monthlyUsers = [
      {
        name: "Tháng 1",
        TotalUsers: 0,
      },
      {
        name: "Tháng 2",
        TotalUsers: 0,
      },
      {
        name: "Tháng 3",
        TotalUsers: 0,
      },
      {
        name: "Tháng 4",
        TotalUsers: 0,
      },
      {
        name: "Tháng 5",
        TotalUsers: 0,
      },
      {
        name: "Tháng 6",
        TotalUsers: 0,
      },
      {
        name: "Tháng 7",
        TotalUsers: 0,
      },
      {
        name: "Tháng 8",
        TotalUsers: 0,
      },
      {
        name: "Tháng 9",
        TotalUsers: 0,
      },
      {
        name: "Tháng 10",
        TotalUsers: 0,
      },
      {
        name: "Tháng 11",
        TotalUsers: 0,
      },
      {
        name: "Tháng 12",
        TotalUsers: 0,
      },
    ];

    for (let i = 0; i < users.length; i++) {
      if (users[i]?._id?.month === 1) {
        monthlyUsers[0] = {
          name: "Tháng 1",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 2) {
        monthlyUsers[1] = {
          name: "Tháng 2",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 3) {
      monthlyUsers[2] = {
          name: "Tháng 3",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 4) {
      monthlyUsers[3] = {
          name: "Tháng 4",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 5) {
      monthlyUsers[4] = {
          name: "Tháng 5",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 6) {
      monthlyUsers[5] = {
          name: "Tháng 6",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 7) {
      monthlyUsers[6] = {
          name: "Tháng 7",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 8) {
      monthlyUsers[7] = {
          name: "Tháng 8",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 9) {
      monthlyUsers[8] = {
          name: "Tháng 9",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 10) {
        monthlyUsers[9] = {
          name: "Tháng 10",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 11) {
        monthlyUsers[10] = {
          name: "Tháng 11",
          TotalUsers: users[i].count
        }
      }
      if (users[i]?._id?.month === 12) {
        monthlyUsers[11] = {
          name: "Tháng 12",
          TotalUsers: users[i].count
        }
      }
    }

    return res.status(200).json({
      error: false,
      success: true,
      TotalUsers: monthlyUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}
