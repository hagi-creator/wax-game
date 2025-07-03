import React from 'react';
import { useUAL } from 'ual-reactjs-renderer';

export default function AnchorLogin() {
  const [ual] = useUAL();

  const login = () => ual.showModal();
  const logout = () => ual.logout();

  return (
    <div>
      {!ual.activeUser ? (
        <button
          onClick={login}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Войти через Anchor
        </button>
      ) : (
        <div>
          <p>✅ Вы вошли как: {ual.activeUser.getAccountName()}</p>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
