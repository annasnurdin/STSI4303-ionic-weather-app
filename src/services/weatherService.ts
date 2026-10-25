import axios from 'axios';

// Instance Axios untuk Open-Meteo API
const api = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
});

// Fungsi untuk mengambil data prakiraan cuaca Jakarta
export const getWeatherData = () => {
  return api.get('/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m');
};

export default api;
