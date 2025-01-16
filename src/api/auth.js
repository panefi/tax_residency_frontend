import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

/**
 * Logs in a user.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
export async function login(username, password) {
  const response = await axios.post(`${API_URL}/users/login`, { username, password });
  return response.data;
}

/**
 * Registers a new user.
 * @param {string} username 
 * @param {string} password 
 * @param {string} full_name 
 * @returns {Promise<Object>}
 */
export async function register(username, password, full_name) {
  const response = await axios.post(`${API_URL}/users/register`, { username, password, full_name });

  return response.data;
} 