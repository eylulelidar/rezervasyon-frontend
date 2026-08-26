import { useEffect, useState } from 'react';
import { getUserReservations, cancelReservation } from '../services/reservationService';

const statusLabels = {
  ONAYLANDI: 'Onaylandı',
  IPTAL_EDILDI: 'İptal Edildi',
};

function MyReservations({ userId, refreshTrigger, onReservationChanged }) {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const loadReservations = () => {
    getUserReservations(userId)
      .then((response) => setReservations(response.data))
      .catch(() => setError('Rezervasyonlar yüklenemedi.'));
  };

  useEffect(() => {
    if (userId) loadReservations();
  }, [userId, refreshTrigger]);

  const handleCancel = (id) => {
    cancelReservation(id)
      .then(() => {
        loadReservations();
        onReservationChanged();
      })
      .catch(() => setError('İptal işlemi başarısız.'));
  };

  if (!userId) return null;

  const byDateDesc = (a, b) => new Date(b.startTime) - new Date(a.startTime);

  const approved = reservations
    .filter((r) => r.status === 'ONAYLANDI')
    .sort(byDateDesc);

  const cancelled = reservations
    .filter((r) => r.status === 'IPTAL_EDILDI')
    .sort(byDateDesc);

  const renderItem = (r) => (
    <li key={r.id}>
      {r.room.name} — {new Date(r.startTime).toLocaleString('tr-TR')} - {new Date(r.endTime).toLocaleString('tr-TR')} — Durum: {statusLabels[r.status] || r.status}
      {r.status === 'ONAYLANDI' && new Date(r.endTime) > new Date() && (
        <button 
          onClick={() => handleCancel(r.id)}
          style={{ marginLeft: '10px', backgroundColor: '#2f9e44' }}
    >
          İptal Et
        </button>
      )}
    </li>
  );

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {reservations.length === 0 && <p>Henüz rezervasyonun yok.</p>}

      {approved.length > 0 && (
        <>
          <h3>Onaylanan Rezervasyonlar</h3>
          <ul>{approved.map(renderItem)}</ul>
        </>
      )}

      {cancelled.length > 0 && (
        <>
          <h3>İptal Edilen Rezervasyonlar</h3>
          <ul>{cancelled.map(renderItem)}</ul>
        </>
      )}
    </div>
  );
}

export default MyReservations;