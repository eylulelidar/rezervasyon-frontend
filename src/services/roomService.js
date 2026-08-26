import api from './api';

export const getAllRooms = () => api.get('/rooms');
export const getRoomById = (id) => api.get(`/rooms/${id}`);
export const updateRoom = (id, room) => api.put(`/rooms/${id}`, room);
export const createRoom = (room, requesterId) => api.post(`/rooms?requesterId=${requesterId}`, room);
export const deleteRoom = (id, requesterId) => api.delete(`/rooms/${id}?requesterId=${requesterId}`);