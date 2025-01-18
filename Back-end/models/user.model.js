import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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

export const User = mongoose.model("User",userSchema);