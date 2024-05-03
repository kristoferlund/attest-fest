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
import { createConfig, http } from "wagmi";

import { walletConnect } from "wagmi/connectors";

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
] as const;

export const wagmiConfig = createConfig({
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    }),
  ],
  chains: supportedChains,
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [optimism.id]: http(
      `https://opt-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [arbitrum.id]: http(
      `https://arb-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [polygon.id]: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [scroll.id]: http(),
    [linea.id]: http(),
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [optimismSepolia.id]: http(
      `https://opt-sepolia.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    ),
    [polygonMumbai.id]: http(),
    [scrollSepolia.id]: http(),
  },
});
