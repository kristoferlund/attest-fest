import { configureChains, createConfig, mainnet, sepolia } from "wagmi";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { base, baseSepolia, optimism, optimismSepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const supportedChains = [
  mainnet,
  optimism,
  base,
  sepolia,
  optimismSepolia,
  baseSepolia,
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
        projectId: "880b1fa160b6bcbe83f57971d986c51d",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});
