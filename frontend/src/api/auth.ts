import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;


export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/login/`, {
    email,
    password,
  });
  return res.data;
};

export const signupUser = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE_URL}/signup/`, {
    email,
    password,
  });
  return res.data;
};
