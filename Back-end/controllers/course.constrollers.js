import { Course } from "../models/course.model.js";

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
