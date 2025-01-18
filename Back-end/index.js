import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";

const app = express();
dotenv.config();

app.use(express.json());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

const port = process.env.port || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
} catch (error) {
  console.log("Error Connecting to DB");
}

await app.use("/api/v1/user", userRoute);
await app.use("/api/v1/course", courseRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
