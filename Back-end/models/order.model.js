import mongoose, { Mongoose } from "mongoose";

const orderSchema = new mongoose.Schema({
  courseId: String,
  paymentId: String,
  amount: Number,
  status: String,
});

export const Order = mongoose.model("Order", orderSchema);
