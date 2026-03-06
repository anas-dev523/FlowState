import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Intercepteur : ajoute automatiquement le token JWT a chaque requete
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export default API;
