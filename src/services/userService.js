import api from './api';

export const getAllUsers = () => api.get('/users');
export const promoteToAdmin = (userId, requesterId) =>
  api.put(`/users/${userId}/promote?requesterId=${requesterId}`);