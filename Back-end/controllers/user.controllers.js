import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { mongo } from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const SignUp = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  const userSchema = z.object({
    FirstName: z
      .string()
      .min(3, { message: "There should be atleast 3 characters" }),
    LastName: z
      .string()
      .min(3, { message: "There should be atleast 3 characters" }),
    Email: z
      .string()
      .min(3, { message: "There should be atleast 3 characters" }),
    Password: z.string().min(8, {
      message: "The Password is not strong use atleast 8 characters",
    }),
  });

  const validateData = userSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ error: validateData.error.issues.map((err) => err.message) });
  }

  var hashPassword = await bcrypt.hash(Password, 10);

  try {
    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      FirstName,
      LastName,
      Email,
      Password: hashPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: "User signed up successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
      
  try {   
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const founded = await bcrypt.compare(Password, user.Password);
    
    if (!founded) {
      return res
      .status(401)
      .json({ message: "Incorrect username and password" });
    } else {
      //console.log(config.JWT_USER_PASSWORD);
      const token = jwt.sign(
        {
          id: user._id,
        },
        config.JWT_USER_PASSWORD
      );
      res.cookie("jwt", token);
      return res.status(200).json({ message: "Login Successful", user, token });
    }
  } catch (error) {
    return res.status(400).json({ error: "Error in MongoDB" });
  }
};

export const Logout = async (req,res)=>{
  try {
    res.clearCookie("jwt");
    res.status(200).json({message : "Logout Successfully!"});    
  } catch (error) {
    res.status(500).json({error : "Error while logging out",error});
    console.log("Error while logging out");
  }
};

export const Purchases = async (req,res)=>{
  const userId = req.userId;

  try {
    const purchased_courses = await Purchase.find({userId});
    const Purchased = [];
    for(let i = 0; i<purchased_courses.length; i++){
      Purchased.push(purchased_courses[i].courseId);
      console.log(purchased_courses[i].courseId);
    }
    
    const  Course_Data = await Course.find({
      _id : {$in : Purchased},
    });
     res.status(200).json({Purchased,Course_Data});
   } catch (error) {
     res.status(500).json({message : "Error while taking course",error});
   }

};