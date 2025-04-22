import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    products: [
      {
        productId: {
          type: String
        },
        productTitle: {
          type: String
        },
        quantity: {
          type: Number
        },
        price: {
          type: Number
        },
        image: {
          type: String
        },
        subTotal: {
          type: Number
        },
      }
    ],
    order_status: {
      type: String,
      default: "Chờ xác nhận"
    },
    paymentId: {
        type: String,
        default: ""
    },
    payment_status: {
        type: String,
        default: ""
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "address"
    },
    totalAmount: {
        type: Number,
        default: 0
    }
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
