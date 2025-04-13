import mongoose from "mongoose";

const productFlavorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const productFlavorModel = mongoose.model("ProductFlavor", productFlavorSchema);

export default productFlavorModel;
