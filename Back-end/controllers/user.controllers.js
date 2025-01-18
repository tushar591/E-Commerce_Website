import { User } from "../models/user.model.js";

export const SignUp = async (req, res) => {
    const { FirstName, LastName, Email, Password } = req.body;
  
    try {
      const existingUser = await User.findOne({ Email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      const newUser = new User({ FirstName, LastName, Email, Password});
      await newUser.save();
  
      return res.status(201).json({ message: "User signed up successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };