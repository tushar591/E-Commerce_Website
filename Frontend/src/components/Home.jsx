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
import { use } from "react";
import { toast } from "react-hot-toast";
import Courses from "./Courses";
import Coursesvdos from "./Coursesvdos";

export default function Home() {
  var [course, setCourse] = React.useState([]);
  var [loggedin, setLoggedIn] = React.useState(false);

  useEffect(() => {
     if(localStorage.getItem("token")){
       setLoggedIn(true);
     }
     else {
       setLoggedIn(false);
     }
  },[]);

  const handlelogout = async ()=> {
    try {
      const response = axios.get("http://localhost:4001/api/v1/user/logout", {
        withCredentials: true,
      })
      console.log(response);
      toast.success("Successfully logged out");
      setLoggedIn(false);
    } catch (error) {
      toast.error("Error while logging out");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/course/courses",
          {
            withCredentials: true,
          }
        );
        setCourse(response.data.courses);
      } catch (err) {
        console.log("Error occured while fetching Data", err);
      }
    };
    fetchData();
  }, []);

  var settings = {
    vertical : false,
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

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen text-white container mx-auto">
        {/*HEADER*/}
        <header className="flex items-center justify-between py-5">
          <div className="flex space-x-2 justify-center">
            <img src={logo} alt="" className="h-10 w-10 rounded-full"></img>
            <h1 className="text-2xl font-bold text-orange-500">
              Course Heaven
            </h1>
          </div>
          <div className="flex space-x-2 justify-center">
            {(loggedin) ? (
              <button
                className="m-4 p-2 rounded text-center border bg-white text-black font-semibold hover:bg-red-600 hover:text-white"
                onClick={handlelogout}
              >
                Logout
              </button>
            ) : (
              <div>
                <Link to={"/login"} className="bg-transparent border-2 rounded p-1">
              Login
            </Link>
            <Link
              to={"/signup"}
              className="bg-transparent border-2 rounded p-1"
            >
              Signup
            </Link>
              </div>
            )}
          </div>
        </header>

        {/*SECTION*/}
        <section className="text-center max-h-500">
          <h1 className="text-orange-500 text-3xl font-lightbold">
            Course Heaven
          </h1>
          <p className="text-gray-400 p-5">
            Upskill Yourself By Under The Guidance of Experts
          </p>
          <Link to={"/courses"} className="mt-4 m-4 p-2 rounded text-center border bg-green-500 text-white font-semibold hover:bg-white hover:text-black">
            Explore Courses
          </Link>
          <Link to={"/coursesvdos"} className="m-4 p-2 rounded text-center border bg-white text-black font-semibold hover:bg-green-500 hover:text-white">
            Courses Videos
          </Link>
        </section>

        {/*SLIDER*/}
        <section>
            <Slider {...settings}>
            {course.map((item) => (
            <div className="slider-container">
              <div>
                <div className="">
                    <div key={item.id} className="p-4">
                     <div className="bg-gray-800 rounded-lg oveflow-hidden relative flex-shrink-0 w-92 transition-transform duration-500">
                     <img
                        src={item.image}
                        alt=""
                        className="h-32 w-full object-contain"
                      ></img>
                      <div className="p-6 text-center">
                        <h1>{item.title}</h1>
                        <button className="m-4 p-2 rounded-full text-center border bg-orange-500 text-white font-semibold hover:bg-white hover:text-black">
                          Enroll Now
                        </button>
                      </div>
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
          <div className="text-center grid grid-cols-3 md:grid-col-1">
            <div>
              <div className="flex justify-center space-x-2">
                <img src={logo} alt="" className="h-5 w-5 rounded-full"></img>
                <h1 className="text-1xl font-bold text-orange-500">
                  Course Heaven
                </h1>
              </div>
              <p className="font-semibold">Follow us</p>
              <div className="flex justify-center items-center p-4">
                <a href="" className="text-3xl p-2 hover:text-pink-500 ">
                  <FaInstagramSquare />
                </a>
                <a href="" className="text-3xl p-2 hover:text-blue-500 ">
                  <FaTwitter />
                </a>
                <a href="" className=" text-3xl p-2 hover:text-blue-800">
                  <FaFacebook />
                </a>
              </div>
            </div>
            <div>
              <h1 className="font-bold mb-2">Reach us </h1>
              <div>
                <p className="text-gray-500 hover:text-2xl cursor-pointer hover:text-white">
                  Github
                </p>
                <p className="text-gray-500 hover:text-2xl cursor-pointer hover:text-white">
                  Linked-In
                </p>
                <p className="text-gray-500 hover:text-2xl cursor-pointer hover:text-white">
                  Instagram
                </p>
              </div>
            </div>
            <div>
              <h1 className="font-bold mb-2">Copyright &#169; 2025</h1>
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
