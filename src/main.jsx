import 'regenerator-runtime/runtime';
import React from "react";
import ReactDOM from "react-dom/client";
import { UALProvider } from "ual-reactjs-renderer";
import { Anchor } from "ual-anchor";
import App from "./WaxGameUI";

const waxChain = {
  chainId: "1064487b3cd1a89764f368dff1a53f8f26f73d94759a4a179f76f05e4e09d5b6",
  rpcEndpoints: [
    {
      protocol: "https",
      host: "wax.greymass.com",
      port: 443,
    },
  ],
};

const anchor = new Anchor([waxChain], {
  appName: "WaxGame",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UALProvider chains={[waxChain]} authenticators={[anchor]} appName="WaxGame">
      <App />
    </UALProvider>
  </React.StrictMode>
);
