import { useState } from 'react';
import { registerUser } from '../services/authService';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

    if (password.length < 8) {
      setError('Kayıt başarısız: Şifre en az 8 karakter olmalıdır.');
      return; 
    }

    if (!passwordRegex.test(password)) {
      setError('Kayıt başarısız: Şifre en az bir harf ve en az bir sayı içermelidir.');
      return; 
    }

    registerUser({ name, email, password, role: 'USER' })
      .then((response) => {
        setMessage(`Kayıt başarılı! Hoş geldin, ${response.data.name}.`);
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        const backendMessage = err.response?.data?.message || err.message;
        setError('Kayıt başarısız: ' + backendMessage);
      });
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
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
          placeholder="Şifre (Min 8 karakter, harf ve sayı)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kayıt Ol</button>
      </form>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Register;