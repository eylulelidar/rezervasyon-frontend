import api from './api';

export const registerUser = (user) => api.post('/auth/register', user);
export const loginUser = (email) => api.get(`/auth/login?email=${email}`);