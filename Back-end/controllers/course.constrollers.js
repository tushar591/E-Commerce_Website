import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";


export const createCourse = async (req, res) => {
  const { title, description, price,image} = req.body;

  try {
    if (!title || !description || !price || !image){
        return res.sendStatus(400).json({ error: "One of the Field is not provided" });
    }
    
    // const { image } = req.files;
    // if (!req.files)
    //   return res.send(400).json({ error: "No file is Uploaded!" });

    // const allowed = ["image/png", "image.jpg"];
    // if (!allowed.includes(image.mimetype))
    //   return res.send(400).json({
    //     error: "The File Type is Not Accepted.Please provide in JPG.",
    //   });
    
    const CourseData = {
      title,
      description,
      price,
      image,
    };
    const course = await Course.create(CourseData);
    res.json({
        message: "Course created successfully",
        course,
      });
  } catch (error) {
    console.log("Error Creating Course");
  }
};

export const UpdateCourse = async (req, res) => {
  const id = req.params.courseid;
  var { title, description, price, image } = req.body;

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
      }
    );
    res.status(201).json({ message: "Course Updated Successfully!!!"});
  } catch (error) {
    res.status(500).json({ error: "Error in Course Updating" });
    console.log(error);
  }
};

export const DeleteCourse = async (req,res)=>{
   const id = req.params.courseid;
   const deleted = await Course.deleteOne({ _id: id });
   if(deleted) res.send(201).json({message : "Successfully Deleted !"});
   else res.send(404).json({error : "Error in Deletion of Block"});
};

export const getCourse = async (req,res)=>{
  try {
    const courses = await Course.find({});
    if (courses) {
      return res.status(201).json({ message: "Fetched all courses successfully", courses });
    } else {
      return res.status(200).json({ message: "No courses found" });
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Error fetching courses from the database" });
  }
  
};

export const courseDetails = async (req,res) =>{
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

export const buyCourse = async (req,res)=>{
   const {userId} = req;
   const {courseId} = req.params;

   try {
    const course = await Course.findById({courseId});
    if(!courseId){
      return res.status(401).json({message : "No course found"});
    }
    const existingPurchase = Purchase.find({userId,courseId});
    if(existingPurchase){
      return res.status(401).json({message : "The course is already purchased"});
    }

    const newCourse = new Purchase({userId,courseId});
    await newCourse.save();
    return res.status(201).json({message : "Course purchased Successfully!"});
   } catch (error) {
      return res.status(401).json({error : "Error while verifying course",error});
   }
  
};