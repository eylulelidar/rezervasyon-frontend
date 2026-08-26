import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import tr from 'date-fns/locale/tr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getAllReservations } from '../services/reservationService';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: tr }),
  getDay,
  locales: { tr },
});

const messages = {
  today: 'Bugün',
  previous: 'Geri',
  next: 'İleri',
  month: 'Ay',
  week: 'Hafta',
  day: 'Gün',
  agenda: 'Ajanda',
  date: 'Tarih',
  time: 'Saat',
  event: 'Etkinlik',
  noEventsInRange: 'Bu aralıkta rezervasyon yok.',
  showMore: (total) => `+${total} daha fazla`,
};

const formats = {
  agendaDateFormat: (date) => format(date, 'd MMM EEEEEE', { locale: tr }),
};

const sameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

function CustomToolbar({ label, onNavigate, onView, view }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', color: '#14181f', marginBottom: '10px' }}>
        {label}
      </div>
      <div className="calendar-toolbar-buttons">
        <div className="rbc-btn-group">
          <button type="button" onClick={() => onNavigate('TODAY')}>Bugün</button>
          <button type="button" onClick={() => onNavigate('PREV')}>Geri</button>
          <button type="button" onClick={() => onNavigate('NEXT')}>İleri</button>
        </div>
        <div className="rbc-btn-group">
          <button type="button" className={view === 'month' ? 'rbc-active' : ''} onClick={() => onView('month')}>Ay</button>
          <button type="button" className={view === 'week' ? 'rbc-active' : ''} onClick={() => onView('week')}>Hafta</button>
          <button type="button" className={view === 'day' ? 'rbc-active' : ''} onClick={() => onView('day')}>Gün</button>
          <button type="button" className={view === 'agenda' ? 'rbc-active' : ''} onClick={() => onView('agenda')}>Ajanda</button>
        </div>
      </div>
    </div>
  );
}

function CalendarView({ refreshTrigger }) {
  const [reservations, setReservations] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    getAllReservations().then((response) => {
      const active = response.data.filter((r) => r.status === 'ONAYLANDI');
      setReservations(active);
    });
  }, [refreshTrigger]);

  const seenDays = [];
  const dayMarkers = [];
  reservations.forEach((r) => {
    const start = new Date(r.startTime);
    const alreadyMarked = seenDays.some((d) => sameDay(d, start));
    if (!alreadyMarked) {
      seenDays.push(start);
      const dayStart = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
      const dayEnd = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59);
      dayMarkers.push({
        title: 'Rezervasyon var',
        start: dayStart,
        end: dayEnd,
        allDay: true,
        day: dayStart,
      });
    }
  });

  const realEvents = reservations.map((r) => ({
    title: r.room.name,
    start: new Date(r.startTime),
    end: new Date(r.endTime),
    day: new Date(r.startTime),
  }));

  const isMonthView = view === Views.MONTH;
  const events = isMonthView ? dayMarkers : realEvents;

  const handleSelectEvent = (event) => {
    setSelectedDay(event.day);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDay(slotInfo.start);
  };

  const dayReservations = selectedDay
    ? reservations.filter((r) => sameDay(new Date(r.startTime), selectedDay))
    : [];

  return (
    <div>
      <h2>Takvim</h2>
      <div style={{ overflowX: 'auto' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          culture="tr"
          messages={messages}
          formats={formats}
          view={view}
          date={date}
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setDate(newDate)}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={() =>
            isMonthView
              ? { style: { display: 'none' } }
              : {
                  style: {
                    backgroundColor: '#c3ecd0',
                    color: '#0d3319',
                    border: '1px solid #9ed9b0',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                  },
                }
          }
          dayPropGetter={(day) => {
            const hasReservation = seenDays.some((d) => sameDay(d, day));
            if (hasReservation) {
              return { style: { backgroundColor: '#d7f5db', cursor: 'pointer' } };
            }
            return {};
          }}
          components={{ toolbar: CustomToolbar }}
        />
      </div>

      {selectedDay && (
        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{selectedDay.toLocaleDateString('tr-TR')} — Rezervasyonlar</h3>
          {dayReservations.length === 0 && <p>Bu günde rezervasyon yok.</p>}
          <ul>
            {dayReservations.map((r) => (
              <li key={r.id}>
                {r.room.name} — {new Date(r.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} - {new Date(r.endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedDay(null)}>Kapat</button>
        </div>
      )}
    </div>
  );
}

export default CalendarView;