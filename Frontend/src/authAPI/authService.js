
import axios from 'axios';

const API_URL = 'https://room-finder-1ayo.onrender.com/api/'; 

let token = localStorage.getItem("token")
export const register = (userData) => {
  console.log("Token : ",token)
  return axios.post(`${API_URL}register/`, userData);
};

export const login = (credentials) => {
   console.log("Token : ",token)
  return axios.post(`${API_URL}login/`, credentials);
};



