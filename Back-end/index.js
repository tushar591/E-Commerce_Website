import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";
import cookie from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-website-ten-eta.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.url}`);
//   console.log("Request Body:", req.body);
//   next();
// });

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

const port = process.env.PORT || 4002;
const DB_URI = process.env.MONGO_URI;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);   
app.use("/api/v1/admin", adminRoute);   
app.use("/api/v1/order", orderRoute);
   
const startServer = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log("Error Connecting to DB:", error);
  }
};

startServer();
