import React, { useEffect } from "react";
import logo from "../../public/wp5231557.jpg";
import { Link } from "react-router-dom";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils.js";

export default function Home() {
  var [course, setCourse] = React.useState([]);
  var [loggedin, setLoggedIn] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  const handlelogout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/admin/logout`);
      localStorage.removeItem("token");
      toast.success("Successfully logged out");
      setLoggedIn(false);
    } catch (error) {
      toast.error("Error while logging out");
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourse(response.data.courses);
      } catch (err) {
        console.log("Error occured while fetching Data", err);
      }
    };
    fetchData();
  }, []);

  var settings = {
    vertical: false,
    verticalSwiping: false,
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  console.log(course)

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="container h-screen mx-auto text-white">
        {/*HEADER*/}
        <header className="flex items-center justify-between py-5">
          <div className="flex justify-center space-x-2">
            <img src={logo} alt="" className="w-10 h-10 rounded-full"></img>
            <h1 className="text-2xl font-bold text-orange-500">
              Course Heaven
            </h1>
          </div>
          <div className="flex justify-center space-x-2">
            {loggedin ? (
              <button
                className="p-2 m-4 font-semibold text-center text-black bg-white border rounded hover:bg-red-600 hover:text-white"
                onClick={handlelogout}
              >
                Logout
              </button>
            ) : (
              <div>
                <Link
                  to={"/login"}
                  className="p-1 bg-transparent border-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="p-1 bg-transparent border-2 rounded"
                >
                  Signup
                </Link>
                <Link
                  to={"/admin/login"}
                  className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </header>

        {/*SECTION*/}
        <section className="text-center max-h-500">
          <h1 className="text-3xl text-orange-500 font-lightbold">
            Course Heaven
          </h1>
          <p className="p-5 text-gray-400">
            Upskill Yourself By Under The Guidance of Experts
          </p>
          <Link
            to={"/courses"}
            className="p-2 m-4 mt-4 font-semibold text-center text-white bg-green-500 border rounded hover:bg-white hover:text-black"
          >
            Explore Courses
          </Link>
          <Link
            to={"/coursesvdos"}
            className="p-2 m-4 font-semibold text-center text-black bg-white border rounded hover:bg-green-500 hover:text-white"
          >
            Courses Videos
          </Link>
        </section>

        {/*SLIDER*/}
        <section>
          <Slider {...settings}>
            {course.map((item) => (
              <div className="slider-container" key={item.id}>
                <div className="p-4">
                  <div className="relative flex-shrink-0 transition-transform duration-500 bg-gray-800 rounded-lg oveflow-hidden w-92">
                    <img
                      src={item.image}
                      alt=""
                      className="object-contain w-full h-32"
                    ></img>
                    <div className="p-6 text-center">
                      <h1>{item.title}</h1>
                      <div className="p-3">
                      <Link
                        to={"/courses"}
                        className="p-2 m-4 font-semibold text-center text-white bg-orange-500 border rounded-full hover:bg-white hover:text-black"
                      >
                        Enroll Now
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr></hr>
        {/*FOOTER*/}
        <footer className="mt-5">
          <div className="grid grid-cols-3 text-center md:grid-col-1">
            <div>
              <div className="flex justify-center space-x-2">
                <img src={logo} alt="" className="w-5 h-5 rounded-full"></img>
                <h1 className="font-bold text-orange-500 text-1xl">
                  Course Heaven
                </h1>
              </div>
              <p className="font-semibold">Follow us</p>
              <div className="flex items-center justify-center p-4">
                <a href="" className="p-2 text-3xl hover:text-pink-500 ">
                  <FaInstagramSquare />
                </a>
                <a href="" className="p-2 text-3xl hover:text-blue-500 ">
                  <FaTwitter />
                </a>
                <a href="" className="p-2 text-3xl hover:text-blue-800">
                  <FaFacebook />
                </a>
              </div>
            </div>
            <div>
              <h1 className="mb-2 font-bold">Reach us </h1>
              <div>
                <p className="text-gray-500 cursor-pointer hover:text-2xl hover:text-white">
                  Github
                </p>
                <p className="text-gray-500 cursor-pointer hover:text-2xl hover:text-white">
                  Linked-In
                </p>
                <p className="text-gray-500 cursor-pointer hover:text-2xl hover:text-white">
                  Instagram
                </p>
              </div>
            </div>
            <div>
              <h1 className="mb-2 font-bold">Copyright &#169; 2025</h1>
              <div>
                <p className="text-gray-500 hover:cursor-pointer hover:text-white">
                  Terms and Conditions
                </p>
                <p className="text-gray-500 hover:cursor-pointer hover:text-white">
                  Privacy Policy
                </p>
                <p className="text-gray-500 hover:cursor-pointer hover:text-white">
                  Refund & Cancellation
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
