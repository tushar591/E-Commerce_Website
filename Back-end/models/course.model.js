import mongoose, { Mongoose } from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type : String,
    required : true
  },
  description: {
    type : String,
    required : true
  },
  price: {
    type : Number,
    required : true
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "admin",
    required: true
  }
});

export const Course = mongoose.model("Course",courseSchema);