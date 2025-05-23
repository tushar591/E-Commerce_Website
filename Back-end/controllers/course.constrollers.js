import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { admin } from "../models/admin.model.js";

export const createCourse = async (req, res) => {
  var { title, description, price, image,adminId } = req.body;
  const Admin = await admin.findById(adminId);
  if (!Admin) {
    return res.status(404).json({ message: "Admin token not provided" });
  }
  try {
    if(!image){
       image = "img.jpg";
    }

    if (!title || !description || !price ) {
      return res
        .status(400)
        .json({ error: "One of the fields is not provided" });
    }

    const courseData = {
      title,
      description,
      price,
      image,
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    res.json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("Error creating course:", error);
    res.status(500).json({ error: "Error creating course", error });
  }
};

export const UpdateCourse = async (req, res) => {
  const id = req.params.courseid;
  const AdminId = req.body.adminId;
 // console.log(AdminId);
  const coursefound = await Course.find({ _id: new mongoose.Types.ObjectId(id) });
  if (!coursefound) {
    res.status(201).json({ message: "Course Not found" });
  }
  var { title, description, price, image } = req.body;
  
 //console.log(req.body);
  try {
    const course = await Course.updateOne(
      {
        _id: id,
      },
      {
        title,
        description,
        price,
        image,
      },
      {
        creatorId: AdminId,
      }
    );
    res.status(201).json({ message: "Course Updated Successfully!!!" });
  } catch (error) {
    res.status(500).json({ error: "Error in Course Updating" });
    console.log(error);
  }
};

export const DeleteCourse = async (req, res) => {
  const id = req.params.courseid;
  console.log(req.params);
  const deleted = await Course.deleteOne({ _id: id });
  if (deleted) res.status(201).json({ message: "Successfully Deleted !" });
  else res.status(404).json({ error: "Error in Deletion of Block" });
};

export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (courses) {
      return res
        .status(201)
        .json({ message: "Fetched all courses successfully", courses });
    } else {
      return res.status(200).json({ message: "No courses found" });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res
      .status(500)
      .json({ message: "Error fetching courses from the database" });
  }
};

export const courseDetails = async (req, res) => {
  const id = req.params.courseid;
  try {
    const result = await Course.findById(id);
    if (result) {
      return res.status(201).json({ message: "Fetched the data", result });
    } else {
      return res.status(404).json({ message: "Can't fetch the data" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Data Not Available in DB", error });
  }
};

import Stripe from "stripe";
import config from "../config.js";
import mongoose from "mongoose";
const stripe = new Stripe(config.STRIPE_KEY);
//console.log(stripe);
export const buyCourse = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;
  //console.log(userId);
  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "No course found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(401)
        .json({ message: "The course is already purchased" });
    }
    //console.log(courseId);
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    const newCourse = new Purchase({ userId, courseId });
    await newCourse.save();
    //console.log(paymentIntent);
    return res
      .status(201)
      .json({
        message: "Course purchased Successfully!",
        course,
        clientSecret: paymentIntent.client_secret,
      });
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Error while verifying course", error });
  }
};
