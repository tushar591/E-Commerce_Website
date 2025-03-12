import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function Buy() {
  const courseId = useParams().courseid;
  //console.log(courseId)
  const [loading, setloading] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handlebuy = async () => {
    if(!token){
      toast.error("Please login first");
      return;
    }

    try {
      setloading(true);
      const response = await axios.post(`http://localhost:4001/api/v1/course/buy/${courseId}`,{},{
        headers:{
          Authorization : `Bearer ${token}`
        },
        withCredentials : true,
      });
      toast.success("Course Purchased Successfully");
      navigate("/purchases");
      setloading(false);
    } catch (error) {
      setloading(false);
      if(error?.response?.status === 401){
        toast.error("The course has been already purchased");
      }
      else{
        toast.error(error?.response?.data?.message);
      }
    }

  }

  return (
    <div className="flex h-screen justify-center items-center">
      <button
        onClick={handlebuy}
        disabled={loading}
        className="bg-blue-500  text-white px-4 py-2 rounded-md hover:bg-blue-800 duration-200"
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
