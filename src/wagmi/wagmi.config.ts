import {
  arbitrum,
  base,
  linea,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  scroll,
  scrollSepolia,
  sepolia,
} from "wagmi/chains";
import { configureChains, createConfig } from "wagmi";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

export const supportedChains = [
  mainnet,
  optimism,
  base,
  arbitrum,
  polygon,
  scroll,
  linea,
  sepolia,
  optimismSepolia,
  polygonMumbai,
  scrollSepolia,
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
