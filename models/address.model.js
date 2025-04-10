import mongoose from "mongoose";

const addressSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },
    address_details: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
