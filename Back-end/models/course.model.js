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
  image:{
    type : String,
    required : true
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "admin",
    required: true
  }
});

export const Course = mongoose.model("Course",courseSchema);