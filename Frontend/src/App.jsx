import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'  
import Signup from './components/Signup'
import { Toaster } from 'react-hot-toast'
import Buy from './components/Buy'
import Courses from './components/Courses'
import Purchases from './components/Purchases'
import Coursesvdos from './components/Coursesvdos'
import AdminLogin from './admin/AdminLogin'
import AdminSignup from './admin/AdminSignup'
import CourseCreate from './admin/CourseCreate'
import Dashboard from './admin/Dashboard'
import OurCourse from './admin/OurCourse'
import UpdateCourse from './admin/UpdateCourse'
import ChatAssistant from './components/Chatassitance/Chatassistance'

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/buy/:courseid" element={<Buy/>} />
      <Route path="/courses" element={<Courses/>} />
      <Route path="/purchases" element={<Purchases/>} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/signup" element={<AdminSignup/>} />
      <Route path="/admin/create-course" element={<CourseCreate/>} />
      <Route path="/admin/dashboard" element={<Dashboard/>} />
      <Route path="/admin/our-courses" element={<OurCourse/>} />
      <Route path="/admin/update-course/:id" element={<UpdateCourse/>} />
    </Routes>
    <ChatAssistant />
    <Toaster></Toaster>
    </div>

  )
}

export default App;