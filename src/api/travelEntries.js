import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

export const getTravelEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/travel/my_travels`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch travel entries');
  }
};

export const addTravelEntry = async (entry) => {
  try {
    const response = await axios.post(`${API_URL}/travel/travel-entries`, entry);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add travel entry');
  }
}; 