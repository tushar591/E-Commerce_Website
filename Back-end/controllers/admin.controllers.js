import {admin} from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { mongo } from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const SignUp = async (req, res) => {
  const { FirstName, LastName, Email, Password } = req.body;

  const adminSchema = z.object({
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

  const validateData = adminSchema.safeParse(req.body);
  if (!validateData.success) {
    return res
      .status(400)
      .json({ error: validateData.error.issues.map((err) => err.message) });
  }

  var hashPassword = await bcrypt.hash(Password, 10);

  try {
    const existingadmin = await admin.findOne({ Email });
    if (existingadmin) {
      return res.status(409).json({ message: "admin already exists" });
    }

    const newadmin = new admin({
      FirstName,
      LastName,
      Email,
      Password: hashPassword,
    });
    await newadmin.save();

    return res.status(201).json({ message: "admin signed up successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const Login = async (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
  //console.log("Received Login Request:", req.body);
  try {   
    const Admin = await admin.findOne({ Email });
    if (!Admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const founded = await bcrypt.compare(Password, Admin.Password);
    
    if (!founded) {
      return res
      .status(401)
      .json({ message: "Incorrect adminname and password" });
    } else {
      const token = jwt.sign(
        {
          id: admin._id,
        },
        config.JWT_ADMIN_PASSWORD
      );
      res.cookie("jwt", token);
      return res.status(200).json({ message: "Login Successful", Admin, token });
    }
  } catch (error) {
    return res.status(400).json({ error: "Error in MongoDB" });
  }
};

export const Logout = async (req,res)=>{
  try {
    if(!req.cookies.jwt){
      return res.status(204).json({message : "No token found"});
    } 
    res.clearCookie("jwt");
    res.status(200).json({message : "Logout Successfully!"});    
  } catch (error) {
    res.status(500).json({error : "Error while logging out",error});
    console.log("Error while logging out");
  }
};