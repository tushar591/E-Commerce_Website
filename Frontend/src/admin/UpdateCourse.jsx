import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils.js';

export default function UpdateCourse() {

  const {id} = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/${id}`);
        console.log(response.data.result);
        setTitle(response.data.result.title);
        setDescription(response.data.result.description);
        setPrice(response.data.result.price);
        setImage(response.data.result.image);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Error Fetching Course Data")
        setLoading(false);
      }
    };
      fetchCourse();
    },[id]);

    const changePhotoHandler = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
        setImage(file);
      };
    };

  function handleUpdateCourse(e) {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("title", title);
    // formData.append("description", description);    
    // formData.append("price", price);
    // formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    const adminId = admin?.Admin._id;
    console.log(adminId);
    if(!token) {
      toast.error("Please login first");
      navigate("/admin/login");
      return;
    }

    try {
      const res = axios.put(`${BACKEND_URL}/course/update/${id}`,{
        title, description, price, image,adminId
      },
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success("Course Updated Successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      toast.error("Error in updating Data");
      console.log(error);
    }
      
    }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Course</h3>
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
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Course"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
