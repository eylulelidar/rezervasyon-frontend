import { useEffect, useState } from 'react';
import { getAllUsers, promoteToAdmin } from '../services/userService';

function AdminUserManager({ userId }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const loadUsers = () => {
    getAllUsers().then((response) => setUsers(response.data));
  };

  useEffect(() => {
    if (userId) loadUsers();
  }, [userId]);

  const handlePromote = (targetId) => {
    setError(null);
    promoteToAdmin(targetId, userId)
      .then(() => loadUsers())
      .catch((err) => setError(err.response?.data?.message || 'İşlem başarısız.'));
  };

  if (!userId) return null;

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <input
        type="text"
        placeholder="İsim veya e-posta ile ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filteredUsers.length === 0 && <p>Eşleşen kullanıcı bulunamadı.</p>}

      <ul>
        {filteredUsers.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email}) — Rol: {u.role}
            {u.role !== 'ADMIN' && (
              <button onClick={() => handlePromote(u.id)}>Admin Yap</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUserManager;