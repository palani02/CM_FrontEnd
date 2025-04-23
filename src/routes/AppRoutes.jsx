// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import {RoleSelection} from "../pages/common/RoleSelection";
import {Login} from "../pages/common/Login";
import {Dashboard} from "../pages/student/Dashboard";
import {EnrollCourse} from "../pages/student/EnrollCourse";
import {UnenrollCourse} from "../pages/student/UnenrollCourse";
import {AddCourse} from "../pages/admin/AddCourse";
import {EnrolledStudentTable} from "../pages/admin/EnrolledStudentTable";
import {Register} from "../pages/common/Register";
import {Forgot} from "../pages/common/Forgot";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/enroll" element={<EnrollCourse />} />
      <Route path="/unenroll" element={<UnenrollCourse />} />
      <Route path="/add-course" element={<AddCourse />} />
      <Route path="/students-table" element={<EnrolledStudentTable />} />
      <Route path="/Register" element={<Register/>}/>
      <Route path="/Forgot" element={<Forgot/>}/>
    </Routes>
  );
}
