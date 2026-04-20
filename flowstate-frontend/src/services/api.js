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

API.interceptors.response.use(
  (response) => response,
  (error)=>{
    if (error.response?.status === 401){
    localStorage.removeItem("token");
    localStorage.removeItem("user") ;
    window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const updateProfile = (data) => API.put('/auth/profile', data);
export const updatePassword = (data) => API.put('/auth/password', data);
export const deleteAccount = () => API.delete('/auth/account');
export const forgotPassword  = (data) => API.post('/auth/forgot-password',data);
export const resetPassword  = (data) => API.post('/auth/reset-password',data);

// Habitudes
export const getCatalogue = () => API.get('/habitudes/catalogue');
export const getHabitudes = () => API.get('/habitudes');
export const createHabitude = (data) => API.post('/habitudes', data);
export const suivreHabitude = (id) => API.post(`/habitudes/${id}/suivre`);
export const updateHabitude = (id, data) => API.put(`/habitudes/${id}`, data);
export const deleteHabitude = (id) => API.delete(`/habitudes/${id}`);
export const validerHabitude = (id, data) => API.post(`/habitudes/${id}/valider`, data);


// Sessions focus
export const getSessions = () => API.get('/sessions');
export const startSession = (data) => API.post('/sessions', data);
export const endSession = (id, data) => API.put(`/sessions/${id}/terminer`, data);

// Vidéos
export const getVideos = () => API.get('/videos');
export const logVisionnage = (id, data) => API.post(`/videos/${id}/visionner`, data);

export default API;
