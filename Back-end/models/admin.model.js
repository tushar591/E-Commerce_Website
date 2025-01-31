import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  FirstName: {
    type : String,
    required : true
  },
  LastName: {
    type : String,
    required : true
  },
  Email:{
    type : String,
    required : true
  },
  Password:{
    type : String,
    required : true
  },
});

export const admin = mongoose.model("admin",adminSchema);