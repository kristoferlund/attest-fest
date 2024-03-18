import "./index.css";

import App from "./App.tsx";
import Plausible from "plausible-tracker";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "./wagmi/wagmi.config.ts";

export const plausible = Plausible({
  domain: "attest-fest.party",
  apiHost: "https://attest-fest.party",
  trackLocalhost: true,
});

plausible.enableAutoPageviews();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <Toaster />
      <App />
    </WagmiConfig>
  </React.StrictMode>
);
