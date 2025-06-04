import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils.js';

export default function UpdateCourse() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/${id}`);
        const courseData = response.data.result;
        
        setTitle(courseData.title);
        setDescription(courseData.description);
        setPrice(courseData.price.toString());
        setCurrentImageUrl(courseData.image);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Error fetching course data");
        setLoading(false);
      }
    };
    
    if (id) {
      fetchCourse();
    }
  }, [id]);

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

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Validation
    if (!title.trim() || !description.trim() || !price) {
      toast.error("Please fill all required fields");
      setUpdating(false);
      return;
    }

    if (price <= 0) {
      toast.error("Price must be greater than 0");
      setUpdating(false);
      return;
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    const adminId = admin?.Admin._id;

    if (!token) {
      toast.error("Please login first");
      navigate("/admin/login");
      setUpdating(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("adminId", adminId);
      
      // Only append image if a new one is selected
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
      
    } catch (error) {
      console.error("Error updating course:", error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Error updating course. Please try again.");
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl p-6 mx-auto border rounded-lg shadow-lg">
          <h3 className="mb-8 text-2xl font-semibold">Update Course</h3>
          <form onSubmit={handleUpdateCourse} className="space-y-6">
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
                  src={imagePreview || currentImageUrl || "/imgPL.webp"}
                  alt="Course"
                  className="object-cover w-full h-auto max-w-sm rounded-md"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
              <p className="text-sm text-gray-500">
                Leave empty to keep current image. Supported formats: JPEG, PNG, WebP (Max size: 5MB)
              </p>
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`w-full py-3 px-4 text-white rounded-md transition-colors duration-200 ${
                updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {updating ? "Updating Course..." : "Update Course"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}