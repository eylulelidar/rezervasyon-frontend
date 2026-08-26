import { useState } from 'react';
import { loginUser } from '../services/authService';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setUser(null);
    loginUser(email)
      .then((response) => {
        setUser(response.data);
        onLoginSuccess(response.data);
      })
      .catch(() => {
        setError('Kullanıcı bulunamadı.');
      });
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>

      {user && (
        <p>Hoş geldin, {user.name}!</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;