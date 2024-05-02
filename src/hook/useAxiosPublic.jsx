import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.VITE_API_URL,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;