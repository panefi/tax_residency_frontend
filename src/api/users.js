import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_URL}/users/update-profile`, profileData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};
