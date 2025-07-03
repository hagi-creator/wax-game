import 'regenerator-runtime/runtime';
import React from "react";
import ReactDOM from "react-dom/client";
import { UALProvider } from "ual-reactjs-renderer";
import { Anchor } from "ual-anchor";
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
