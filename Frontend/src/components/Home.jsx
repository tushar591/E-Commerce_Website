import React from "react";
import logo from "../../public/wp5231557.jpg";
import { Link } from "react-router-dom";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

export default function Home() {
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
        </header>

        {/*SECTION*/}
        <section className="text-center">
          <h1 className="text-orange-500 text-3xl font-lightbold p-3">
            Course Heaven
          </h1>
          <p className="text-gray-400">
            Upskill Yourself By Under The Guidance of Experts
          </p>
          <button className="m-4 p-2 rounded text-center border bg-green-500 text-white font-semibold hover:bg-white hover:text-black">
            Explore Courses
          </button>
          <button className="m-4 p-2 rounded text-center border bg-white text-black font-semibold hover:bg-green-500 hover:text-white">
            Courses Videos
          </button>
        </section>
        <section>Section2</section>

        {/*FOOTER*/}
        <footer>
          <div className="text-center grid grid-cols-3 md:grid-col-1">
            <div>
              <div className="flex justify-center space-x-2 m-3">
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
            <div>right</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
