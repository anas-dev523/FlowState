import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});


API.interceptors.response.use(
  (response) => response,
  (error)=>{
    if (error.response?.status === 401){
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
export const logout = () => API.post('/auth/Logout');
export const verifyEmail = (token) => API.get(`/auth/verify-email?token=${token}`);
// Habitudes
export const getCatalogue = () => API.get('/habitudes/catalogue');
export const getHabitudes = () => API.get('/habitudes');
export const suivreHabitude = (id) => API.post(`/habitudes/${id}/suivre`);
export const validerHabitude = (id, data) => API.post(`/habitudes/${id}/valider`, data);
export const devaliderHabitude =(id) => API.delete(`/habitudes/${id}/valider`);
export const getValidationsToday = () => API.get('/habitudes/validations/today');
export const unfollowHabitude = (id) => API.delete(`/habitudes/${id}/suivre`);

// Sessions focus
export const getSessions = () => API.get('/sessions');
export const startSession = (data) => API.post('/sessions', data);
export const endSession = (id, data) => API.put(`/sessions/${id}/terminer`, data);

// Vidéos
export const getVideos = () => API.get('/videos');

// Stats
export const getGlobalStats = () => API.get('/stats/global');
export const getDailyCompletion = (days=14) => API.get(`/stats/daily-completion?days=${days}`);

// Admin - Habits
export const adminCreateHabit = (data) => API.post('/admin/habitudes', data);
export const adminUpdateHabit = (id, data) => API.put(`/admin/habitudes/${id}`, data);
export const adminDeleteHabit = (id) => API.delete(`/admin/habitudes/${id}`);

// Admin - Videos
export const adminCreateVideo = (data) => API.post('/admin/videos', data);
export const adminUpdateVideo = (id, data) => API.put(`/admin/videos/${id}`, data);
export const adminDeleteVideo = (id) => API.delete(`/admin/videos/${id}`);

// Admin - Stats
export const adminGetStats = () => API.get('/admin/stats');

export default API;
