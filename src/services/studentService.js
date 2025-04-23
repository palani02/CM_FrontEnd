import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginStudent = (data) => axios.post(`${BASE_URL}/student/login`, data);
export const registerStudent = (data) => axios.post(`${BASE_URL}/student/register`, data);
export const getStudentCourses = () => axios.get(`${BASE_URL}/student/courses`);
export const enrollCourse = (courseId) => axios.post(`${BASE_URL}/student/enroll/${courseId}`);
export const unenrollCourse = (courseId) => axios.delete(`${BASE_URL}/student/unenroll/${courseId}`);
