import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema(
  {
    productTitle: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    oldPrice: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    flavor: {
      type: String,
    },
    weight: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    },
    productId: {
      type: String,
      required: true
    },
    countInStock: {
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    brand: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const CartProductModel = mongoose.model("cart", cartProductSchema);

export default CartProductModel;
