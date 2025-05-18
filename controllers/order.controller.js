import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import crypto from "crypto";
import moment from "moment";
import querystring from "qs";

const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const port = process.env.PORT;
const vnp_ReturnUrl = `http://localhost:${port}/api/order/vnpay-return`;
const vnp_IpnUrl = `http://localhost:${port}/api/order/vnpay-ipn`;

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
          countInStock:
            req.body.products[i].countInStock &&
            !isNaN(req.body.products[i].countInStock)
              ? parseInt(
                  req.body.products[i].countInStock -
                    req.body.products[i].quantity
                )
              : 0,
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
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 2) {
        monthlyUsers[1] = {
          name: "Tháng 2",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 3) {
        monthlyUsers[2] = {
          name: "Tháng 3",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 4) {
        monthlyUsers[3] = {
          name: "Tháng 4",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 5) {
        monthlyUsers[4] = {
          name: "Tháng 5",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 6) {
        monthlyUsers[5] = {
          name: "Tháng 6",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 7) {
        monthlyUsers[6] = {
          name: "Tháng 7",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 8) {
        monthlyUsers[7] = {
          name: "Tháng 8",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 9) {
        monthlyUsers[8] = {
          name: "Tháng 9",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 10) {
        monthlyUsers[9] = {
          name: "Tháng 10",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 11) {
        monthlyUsers[10] = {
          name: "Tháng 11",
          TotalUsers: users[i].count,
        };
      }
      if (users[i]?._id?.month === 12) {
        monthlyUsers[11] = {
          name: "Tháng 12",
          TotalUsers: users[i].count,
        };
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

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    if (obj[key]) {
      sorted[key] = obj[key];
    }
  }
  return sorted;
}

// Tạo URL thanh toán VNPay
export const createVnpayUrlController = async (req, res) => {
  try {
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    let orderId = `${moment(date).format("DDHHmmss")}${Math.floor(
      Math.random() * 1000
    )}`;
    let amount = req.body.totalAmount;
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ error: true, message: "Số tiền không hợp lệ" });
    }
    let bankCode = req.body.bankCode;
    let locale = "vn" || req.body.language;
    let currentCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_CurrCode"] = currentCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = `Thanh toan don hang ${orderId}`;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", vnp_HashSecret);
    let secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = secureHash;
    let vnpUrl =
      vnp_Url + "?" + querystring.stringify(vnp_Params, { encode: false });

    console.log("VNPAY URL:", vnpUrl);
    console.log("VNPay Params:", vnp_Params);
    console.log("SignData:", signData);
    console.log("SecureHash:", secureHash);

    return res.status(200).json({
      error: false,
      paymentUrl: vnpUrl,
    });
  } catch (err) {
    console.error("VNPay URL creation error:", err);
    return res.status(500).json({
      error: true,
      message: "Không tạo được liên kết thanh toán.",
      details: err.message,
    });
  }
};

// Xử lý kết quả trả về từ VNPay
export async function vnpayReturnController(req, res) {
  const vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const orderId = req.query.vnp_TxnRef;
  const order = await OrderModel.findById(orderId);

  if (!order) {
    return res.status(404).send("Đơn hàng không tồn tại.");
  }

  const sortedParams = querystring.stringify(vnp_Params, { encode: false });
  const signData = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(sortedParams)
    .digest("hex");

  if (secureHash === signData) {
    const transactionStatus = vnp_Params.vnp_TransactionStatus;
    const orderId = vnp_Params.vnp_TxnRef;

    if (transactionStatus === "00") {
      await OrderModel.findByIdAndUpdate(orderId, {
        payment_status: "Đã thanh toán qua thẻ",
        order_status: "Đã thanh toán",
      });

      return res.redirect("/payment-success");
    } else {
      return res.redirect("/payment-failed");
    }
  } else {
    return res.redirect("/payment-failed");
  }
}

// Xử lý IPN (Thông báo giao dịch VNPay)
export async function vnpayIpnController(req, res) {
  const vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = querystring.stringify(vnp_Params, { encode: false });
  const signData = crypto
    .createHmac("sha512", vnp_HashSecret)
    .update(sortedParams)
    .digest("hex");

  if (secureHash === signData) {
    const orderId = vnp_Params.vnp_TxnRef;
    const transactionStatus = vnp_Params.vnp_TransactionStatus;

    if (transactionStatus === "00") {
      await OrderModel.findByIdAndUpdate(orderId, {
        payment_status: true,
        order_status: "Đã thanh toán",
      });

      return res.status(200).json({
        RspCode: "00",
        Message: "Confirm Success",
      });
    } else {
      return res.status(200).json({
        RspCode: "01",
        Message: "Transaction Failed",
      });
    }
  } else {
    return res.status(200).json({
      RspCode: "97",
      Message: "Invalid signature",
    });
  }
}
