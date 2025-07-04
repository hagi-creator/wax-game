import React from "react";
import { withUAL } from "ual-reactjs-renderer";

function AnchorLogin({ ual }) {
  const login = () => ual.showModal();
  const logout = () => ual.logout();

  return (
    <div>
      {!ual.activeUser ? (
        <button
          onClick={login}
          style={{padding: "10px 20px", backgroundColor: "#4CAF50", color: "white"}}
        >
          Войти через Anchor
        </button>
      ) : (
        <div>
          <p>✅ Вы вошли как: {ual.activeUser.getAccountName()}</p>
          <button
            onClick={logout}
            style={{padding: "10px 20px", backgroundColor: "#f44336", color: "white"}}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

export default withUAL(AnchorLogin);
