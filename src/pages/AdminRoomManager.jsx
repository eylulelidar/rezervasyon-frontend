import { useState, useEffect } from 'react';
import { getAllRooms, createRoom, deleteRoom } from '../services/roomService';

function AdminRoomManager({ onRoomsChanged, userId }) {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [equipment, setEquipment] = useState('');
  const [error, setError] = useState(null);

  const loadRooms = () => {
    getAllRooms().then((response) => setRooms(response.data));
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    setError(null);

    createRoom({ name, capacity: Number(capacity), location, equipment }, userId)
      .then(() => {
        setName('');
        setCapacity('');
        setLocation('');
        setEquipment('');
        loadRooms();
        if (onRoomsChanged) onRoomsChanged();
      })
      .catch((err) => setError(err.response?.data?.message || 'Salon eklenemedi.'));
  };

  const handleDelete = (id) => {
    setError(null);
    deleteRoom(id, userId)
      .then(() => {
        loadRooms();
        if (onRoomsChanged) onRoomsChanged();
      })
      .catch((err) => setError(err.response?.data?.message || 'Salon silinemedi.'));
  };

  if (!userId) {
    return <p>Salon yönetimi için giriş yapman gerekiyor.</p>;
  }

  return (
    <div>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Salon Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Kapasite"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Konum"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ekipman"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
        />
        <button type="submit">Salon Ekle</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} — Kapasite: {room.capacity} — {room.location}
            <button onClick={() => handleDelete(room.id)} style={{ marginLeft: '10px' }}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminRoomManager;