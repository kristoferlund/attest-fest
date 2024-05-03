import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import Plausible from "plausible-tracker";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./wagmi/wagmi.config.ts";

export const plausible = Plausible({
  domain: "attest-fest.party",
  apiHost: "https://attest-fest.party",
  trackLocalhost: true,
});

plausible.enableAutoPageviews();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <Toaster />
        <App />
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
