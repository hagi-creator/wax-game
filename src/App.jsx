import { useState } from 'react';
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';

const link = new AnchorLink({
  transport: new AnchorLinkBrowserTransport(),
  chains: [
    {
      chainId: '1064487b3cd1a89764f368dff1a53f8f26f73d94759a4a179f76f05e4e09d5b6',
      nodeUrl: 'https://wax.greymass.com',
    },
  ],
});

export default function App() {
  const [session, setSession] = useState(null);

  const login = async () => {
    try {
      const result = await link.login('wax-game'); // Замените на имя своего dApp
      setSession(result.session);
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  const logout = async () => {
    if (session) {
      await session.remove();
      setSession(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">🚀 WAX Game</h1>
      {!session ? (
        <button
          onClick={login}
          className="bg-yellow-400 text-black px-6 py-3 rounded-2xl hover:bg-yellow-300 transition"
        >
          Войти через Anchor
        </button>
      ) : (
        <>
          <p className="mb-4">👤 Вы вошли как: <strong>{session.auth.actor.toString()}</strong></p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition"
          >
            Выйти
          </button>
        </>
      )}
    </div>
  );
}
