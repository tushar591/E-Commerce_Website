import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import cookie from "cookie-parser";
import cors from "cors";


const app = express();
dotenv.config();

app.use(express.json());
app.use(cookie());
app.use(cors({ 
  credentials: true, 
  origin: "http://localhost:5173",  
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
);


app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

const port = process.env.port || 4002;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("Error Connecting to DB");
}

await app.use("/api/v1/user", userRoute);
await app.use("/api/v1/course", courseRoute);   
await app.use("/api/v1/admin", adminRoute);   

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
