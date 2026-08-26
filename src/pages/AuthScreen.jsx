import { useState } from 'react';
import { registerUser, loginUser } from '../services/authService';

function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage(null);
    setError(null);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    registerUser({ name, email, password, role: 'USER' })
      .then(() => {
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsin.');
        setMode('login');
        setPassword('');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Kayıt başarısız.');
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    loginUser(email)
      .then((response) => {
        onLoginSuccess(response.data);
      })
      .catch(() => {
        setError('Kullanıcı bulunamadı.');
      });
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h1>
        <p className="auth-subtitle">
          Toplantı Salonu Rezervasyon Sistemi
        </p>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Giriş Yap →</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Ad Soyad"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Kayıt Ol →</button>
          </form>
        )}

        {message && <p className="auth-message-success">{message}</p>}
        {error && <p className="auth-message-error">{error}</p>}

        <p className="auth-toggle">
          {mode === 'login' ? (
            <>Hesabınız yok mu? <a onClick={() => switchMode('register')}>Kayıt Ol</a></>
          ) : (
            <>Hesabınız var mı? <a onClick={() => switchMode('login')}>Giriş Yap</a></>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;