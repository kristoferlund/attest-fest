type SafeConfig = {
  id: number;
  serviceUrl: string;
  explorerUrl: string;
  safeChainAbbreviation: string;
};

export const safeConfig: SafeConfig[] = [
  {
    id: 1, // Ethereum
    serviceUrl: "https://safe-transaction-mainnet.safe.global",
    explorerUrl: "https://etherscan.io",
    safeChainAbbreviation: "eth",
  },
  {
    id: 10, // Optimism
    serviceUrl: "https://safe-transaction-optimism.safe.global",
    explorerUrl: "https://optimistic.etherscan.io",
    safeChainAbbreviation: "oeth",
  },
  {
    id: 8453, // Base Mainnet
    serviceUrl: "https://safe-transaction-base.safe.global",
    explorerUrl: "https://basescan.org",
    safeChainAbbreviation: "base",
  },
  {
    id: 42161, // Arbitrum One
    serviceUrl: "https://safe-transaction-arbitrum.safe.global",
    explorerUrl: "https://arbiscan.io",
    safeChainAbbreviation: "arb1",
  },
  {
    id: 137, // Polygon
    serviceUrl: "https://safe-transaction-polygon.safe.global",
    explorerUrl: "https://polygonscan.com/",
    safeChainAbbreviation: "matic",
  },
  {
    id: 11155111, // Ethereum Sepolia
    serviceUrl: "https://safe-transaction-sepolia.safe.global",
    explorerUrl: "https://sepolia.etherscan.io",
    safeChainAbbreviation: "sep",
  },
  // {
  //   id: 84532, // Base Sepolia
  //   serviceUrl: "https://safe-transaction-base-sepolia.safe.global",
  //   explorerUrl: "https://base-sepolia.blockscout.com",
  //   safeChainAbbreviation: "basesep",
  // },
];
