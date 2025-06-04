import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { admin } from "../models/admin.model.js";
import { cloudinary } from "../config/cloudinary.js";
import Stripe from "stripe";
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_KEY);

export const createCourse = async (req, res) => {  
  try {
    const { title, description, price, adminId } = req.body;
    
    // Check if admin exists
    const Admin = await admin.findById(adminId);
    if (!Admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Validate required fields
    if (!title || !description || !price) {
      return res.status(400).json({ error: "Title, description, and price are required" });
    }

    let imageUrl = null;

    // Handle image upload
    if (req.file) {
      // Image uploaded via multer/cloudinary
      imageUrl = req.file.path;
    } else if (req.body.image) {
      // Handle base64 image or direct upload
      if (req.body.image.startsWith('data:image')) {
        // Upload base64 image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.body.image, {
          folder: 'courses',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        });
        imageUrl = uploadResult.secure_url;
      } else {
        // Assume it's already a URL
        imageUrl = req.body.image;
      }
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required" });
    }

    const courseData = {
      title,
      description,
      price: Number(price),
      image: imageUrl,
      creatorId: adminId,
    };

    const course = await Course.create(courseData);
    
    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const UpdateCourse = async (req, res) => {
  try {
    const id = req.params.courseid;
    const { title, description, price, adminId } = req.body;

    // Check if course exists
    const courseFound = await Course.findById(id);
    if (!courseFound) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if admin exists
    const Admin = await admin.findById(adminId);
    if (!Admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let imageUrl = courseFound.image; // Keep existing image by default

    // Handle new image upload
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (courseFound.image) {
        try {
          const publicId = courseFound.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`courses/${publicId}`);
        } catch (error) {
          console.warn("Could not delete old image:", error);
        }
      }
      imageUrl = req.file.path;
    } else if (req.body.image && req.body.image !== courseFound.image) {
      if (req.body.image.startsWith('data:image')) {
        // Delete old image from Cloudinary
        if (courseFound.image) {
          try {
            const publicId = courseFound.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`courses/${publicId}`);
          } catch (error) {
            console.warn("Could not delete old image:", error);
          }
        }
        
        // Upload new base64 image
        const uploadResult = await cloudinary.uploader.upload(req.body.image, {
          folder: 'courses',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        });
        imageUrl = uploadResult.secure_url;
      } else {
        imageUrl = req.body.image;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title: title || courseFound.title,
        description: description || courseFound.description,
        price: price ? Number(price) : courseFound.price,
        image: imageUrl,
        creatorId: adminId,
      },
      { new: true }
    );

    res.status(200).json({ 
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Error updating course" });
  }
};

export const DeleteCourse = async (req, res) => {
  try {
    const id = req.params.courseid;
    
    // Find the course first to get image URL
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Delete image from Cloudinary if it exists
    if (course.image) {
      try {
        const publicId = course.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`courses/${publicId}`);
      } catch (error) {
        console.warn("Could not delete image from Cloudinary:", error);
      }
    }

    // Delete the course
    await Course.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('creatorId', 'name email');
    
    if (courses.length > 0) {
      return res.status(200).json({ 
        message: "Courses fetched successfully", 
        courses 
      });
    } else {
      return res.status(200).json({ 
        message: "No courses found",
        courses: []
      });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ 
      message: "Error fetching courses from the database" 
    });
  }
};

export const courseDetails = async (req, res) => {
  try {
    const id = req.params.courseid;
    
    const result = await Course.findById(id).populate('creatorId', 'name email');
    
    if (result) {
      return res.status(200).json({ 
        message: "Course details fetched successfully", 
        result 
      });
    } else {
      return res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ 
      message: "Error fetching course details", 
      error: error.message 
    });
  }
};

export const buyCourse = async (req, res) => {
  try {
    const { userId } = req;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(400).json({ 
        message: "Course already purchased" 
      });
    }

    const amount = Math.round(course.price * 100); // Convert to cents for Stripe
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        courseId,
        userId
      }
    });

    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();

    return res.status(201).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error purchasing course:", error);
    return res.status(500).json({ 
      error: "Error while processing course purchase" 
    });
  }
};