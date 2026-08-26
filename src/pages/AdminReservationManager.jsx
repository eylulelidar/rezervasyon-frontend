import { useEffect, useState } from 'react';
import { getAllReservations, cancelReservation } from '../services/reservationService';

const statusLabels = {
  ONAYLANDI: 'Onaylandı',
  IPTAL_EDILDI: 'İptal Edildi',
};

const monthNames = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

function AdminReservationManager({ refreshTrigger, onReservationChanged }) {
  const [reservations, setReservations] = useState([]);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11
  const [exactDate, setExactDate] = useState('');
  const [error, setError] = useState(null);

  const loadReservations = () => {
    getAllReservations().then((response) => setReservations(response.data));
  };

  useEffect(() => {
    loadReservations();
  }, [refreshTrigger]);

  const handleCancel = (id) => {
    setError(null);
    cancelReservation(id)
      .then(() => {
        loadReservations();
        if (onReservationChanged) onReservationChanged();
      })
      .catch(() => setError('İptal işlemi başarısız.'));
  };

  const byDateDesc = (a, b) => new Date(b.startTime) - new Date(a.startTime);

  const filtered = reservations.filter((r) => {
    const d = new Date(r.startTime);
    if (exactDate) {
      return d.toISOString().slice(0, 10) === exactDate;
    }
    return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
  });

  const now = new Date();

  const approved = filtered
    .filter((r) => r.status === 'ONAYLANDI' && new Date(r.endTime) > now)
    .sort(byDateDesc);

  const past = filtered
    .filter((r) => r.status === 'ONAYLANDI' && new Date(r.endTime) <= now)
    .sort(byDateDesc);

  const cancelled = filtered
    .filter((r) => r.status === 'IPTAL_EDILDI')
    .sort(byDateDesc);

  const renderItem = (r, showCancelButton) => (
    <li key={r.id}>
      {r.room.name} — {r.user.name} — {new Date(r.startTime).toLocaleString('tr-TR')} - {new Date(r.endTime).toLocaleString('tr-TR')} — Durum: {statusLabels[r.status] || r.status}
      {showCancelButton && (
        <button onClick={() => handleCancel(r.id)} style={{ marginLeft: '10px' }}>
          İptal Et
        </button>
      )}
    </li>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <select
          value={viewMonth}
          onChange={(e) => setViewMonth(Number(e.target.value))}
          disabled={!!exactDate}
          style={{ width: '105px', flexShrink: 0 }}
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index}>{name}</option>
          ))}
        </select>

        <select
          value={viewYear}
          onChange={(e) => setViewYear(Number(e.target.value))}
          disabled={!!exactDate}
          style={{ width: '80px', flexShrink: 0 }}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <input
          type="date"
          value={exactDate}
          onChange={(e) => setExactDate(e.target.value)}
          style={{ minWidth: '130px', flex: 1 }}
        />
      </div>

      {exactDate && (
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <button onClick={() => setExactDate('')}>Temizle</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {filtered.length === 0 && <p>Bu kriterlere uyan rezervasyon yok.</p>}

      {approved.length > 0 && (
        <>
          <h3>Onaylanan Rezervasyonlar</h3>
          <ul>{approved.map((r) => renderItem(r, true))}</ul>
        </>
      )}

      {past.length > 0 && (
        <>
          <h3>Tarihi Geçmiş Rezervasyonlar</h3>
          <ul>{past.map((r) => renderItem(r, false))}</ul>
        </>
      )}

      {cancelled.length > 0 && (
        <>
          <h3>İptal Edilen Rezervasyonlar</h3>
          <ul>{cancelled.map((r) => renderItem(r, false))}</ul>
        </>
      )}
    </div>
  );
}

export default AdminReservationManager;