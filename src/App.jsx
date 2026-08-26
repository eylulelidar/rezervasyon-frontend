import { useState } from 'react';
import './App.css';
import RoomList from './pages/RoomList';
import AuthScreen from './pages/AuthScreen';
import ReservationForm from './pages/ReservationForm';
import MyReservations from './pages/MyReservations';
import CalendarView from './pages/CalendarView';
import AdminRoomManager from './pages/AdminRoomManager';
import AdminUserManager from './pages/AdminUserManager';
import AdminReservationManager from './pages/AdminReservationManager';
import Collapsible from './components/Collapsible';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const loggedInUserId = loggedInUser?.id ?? null;
  const isAdmin = loggedInUser?.role === 'ADMIN';

  if (!loggedInUserId) {
    return <AuthScreen onLoginSuccess={(user) => setLoggedInUser(user)} />;
  }

  return (
    <div className="app-container">
      <div className="top-bar">
        <h1>Toplantı Salonu Rezervasyon Sistemi</h1>
        <div className="top-bar-user">
          <span>Hoş geldin, {loggedInUser.name}!</span>
          <button className="logout-button" onClick={() => setLoggedInUser(null)}>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="layout">
          <div className="main-column">
            <div className="section">
              <Collapsible title="Rezervasyon Oluştur">
                <ReservationForm key={loggedInUserId} userId={loggedInUserId} onReservationCreated={triggerRefresh} />
              </Collapsible>
            </div>

            <div className="section">
              <Collapsible title="Rezervasyonlarım">
                <MyReservations
                  key={loggedInUserId}
                  userId={loggedInUserId}
                  refreshTrigger={refreshTrigger}
                  onReservationChanged={triggerRefresh}
                />
              </Collapsible>
            </div>

            <div className="section section-green">
              <Collapsible title="Salonlar">
                <RoomList />
              </Collapsible>
            </div>

            {isAdmin && (
              <div className="section section-green">
                <Collapsible title="Admin — Salon Yönetimi">
                  <AdminRoomManager onRoomsChanged={triggerRefresh} userId={loggedInUserId} />
                </Collapsible>
              </div>
            )}

            {isAdmin && (
              <div className="section section-green">
                <Collapsible title="Admin — Kullanıcı Yönetimi">
                  <AdminUserManager userId={loggedInUserId} />
                </Collapsible>
              </div>
            )}

            {isAdmin && (
              <div className="section section-green">
                <Collapsible title="Admin — Tüm Rezervasyonlar">
                  <AdminReservationManager refreshTrigger={refreshTrigger} onReservationChanged={triggerRefresh} />
                </Collapsible>
              </div>
            )}
          </div>

          <div className="calendar-column section">
            <CalendarView key={loggedInUserId} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;