import { useEffect, useState } from 'react';
import { getAllRooms } from '../services/roomService';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllRooms()
      .then((response) => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Salonlar yüklenemedi: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} — Kapasite: {room.capacity} — {room.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;