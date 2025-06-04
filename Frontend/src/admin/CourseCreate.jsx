import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils.js";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
        setImage(file);
      };
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!title.trim() || !description.trim() || !price || !image) {
      toast.error("Please fill all fields and select an image");
      setLoading(false);
      return;
    }

    if (price <= 0) {
      toast.error("Price must be greater than 0");
      setLoading(false);
      return;
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    const adminId = admin?.Admin._id;

    if (!token) {
      toast.error("Please Login First");
      navigate("/admin/login");
      setLoading(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("image", image);
      formData.append("adminId", adminId);

      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      
      // Reset form
      setTitle("");
      setPrice("");
      setImage(null);
      setDescription("");
      setImagePreview("");
      
    } catch (error) {
      console.error("Error creating course:", error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error creating course. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl p-6 mx-auto border rounded-lg shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold">Create Course</h3>

          <form onSubmit={handleCreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Course Preview"
                  className="object-cover w-full h-64 max-w-sm border border-gray-300 rounded-md"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500">
                Supported formats: JPEG, PNG, WebP (Max size: 5MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 text-white rounded-md transition-colors duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Creating Course..." : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CourseCreate;