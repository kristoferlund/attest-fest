type EasConfig = {
  id: number;
  address: string;
  registryAddress: string;
  explorerUrl: string;
};

export const easConfig: EasConfig[] = [
  {
    id: 1, // Ethereum
    address: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
    registryAddress: "0xA7b39296258348C78294F95B872b282326A97BDF",
    explorerUrl: "https://easscan.org",
  },
  {
    id: 11155111, // Ethereum Sepolia
    address: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    registryAddress: "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0",
    explorerUrl: "https://sepolia.easscan.org",
  },
  {
    id: 8453, // Base Mainnet
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://base.easscan.org",
  },
  {
    id: 84532, // Base Sepolia
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://base-sepolia.easscan.org",
  },
  {
    id: 10, // Optimism
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://optimism.easscan.org",
  },
  {
    id: 11155420, // Optimism Sepolia
    address: "0x4200000000000000000000000000000000000021",
    registryAddress: "0x4200000000000000000000000000000000000020",
    explorerUrl: "https://optimism-sepolia.easscan.org",
  },
];
