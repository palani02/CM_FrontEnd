import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginAdmin = (data) => axios.post(`${BASE_URL}/admin/login`, data);
export const getStudents = () => axios.get(`${BASE_URL}/admin/students`);
export const getCourses = () => axios.get(`${BASE_URL}/admin/courses`);
export const addCourse = (data) => axios.post(`${BASE_URL}/admin/add-course`, data);
export const removeStudent = (studentId) => axios.delete(`${BASE_URL}/admin/remove-student/${studentId}`);
