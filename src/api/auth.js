import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('API login error:', error.message);
    throw error;
  }
};

export const register = async (username, password, fullName) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, password, fullName });
    return response.data;
  } catch (error) {
    console.error('API register error:', error.message);
    throw error;
  }
}; 