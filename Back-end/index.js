import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const port = process.env.port || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connected");
} catch (error) {
  console.log("Error Connecting to DB");
}


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})