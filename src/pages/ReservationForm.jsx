import { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { getAllRooms } from '../services/roomService';
import { createReservation } from '../services/reservationService';

function ReservationForm({ userId, onReservationCreated }) {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const startRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    getAllRooms().then((response) => setRooms(response.data));
  }, []);

  const formatDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    const startFp = flatpickr(startRef.current, {
      enableTime: true,
      dateFormat: 'd.m.Y H:i',
      time_24hr: true,
      onChange: ([date]) => {
        if (date) setStartTime(formatDate(date));
      },
    });

    const endFp = flatpickr(endRef.current, {
      enableTime: true,
      dateFormat: 'd.m.Y H:i',
      time_24hr: true,
      onChange: ([date]) => {
        if (date) setEndTime(formatDate(date));
      },
    });

    return () => {
      startFp.destroy();
      endFp.destroy();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    createReservation({
      roomId: Number(roomId),
      userId: Number(userId),
      startTime,
      endTime,
    })
      .then((response) => {
        setMessage(`Rezervasyon oluşturuldu! Durum: ${response.data.status}`);
        if (onReservationCreated) onReservationCreated();
      })
      .catch((err) => {
        const backendMessage = err.response?.data?.message || err.message;
        setError('Rezervasyon başarısız: ' + backendMessage);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
          <option value="">Salon Seç</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.location})
            </option>
          ))}
        </select>

        <input type="text" ref={startRef} placeholder="Başlangıç tarihi/saati" required />
        <input type="text" ref={endRef} placeholder="Bitiş tarihi/saati" required />

        <button type="submit">Rezervasyon Yap</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ReservationForm;