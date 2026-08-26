import api from './api';

export const createReservation = (reservation) => api.post('/reservations', reservation);
export const getUserReservations = (userId) => api.get(`/reservations/user/${userId}`);
export const cancelReservation = (id) => api.put(`/reservations/${id}/cancel`);
export const getAllReservations = () => api.get('/reservations');