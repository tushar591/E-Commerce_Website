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
      <Route path="/coursevdos" element={<Coursesvdos/>} />
    </Routes>
    <Toaster></Toaster>
    </div>

  )
}

export default App