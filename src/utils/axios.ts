import axios from "axios";

const BACKEND_REST_API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: BACKEND_REST_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin": "*",
  },
});

const axiosConfig =  () => {return {
  baseURL: BACKEND_REST_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin": "*",
  },
}}

export { axiosInstance, axiosConfig };
